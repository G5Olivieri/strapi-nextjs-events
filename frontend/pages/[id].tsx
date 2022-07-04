import type {GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage} from 'next'
import {EventType} from "../components/events";
import client from "../apollo-client";
import gql from "graphql-tag";
import Header from "../components/header";
import {Clock, MapPin} from "phosphor-react";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";
import Link from "next/link";
import {useEffect, useState} from "react";
import {signIn, useSession} from "next-auth/react";
import axios from "axios";

type GetEventResponseCollection = {
  id: string
  attributes: {
    title: string
    when: string
    description: string
    location: string
    speakers: {
      data: {
        id: string
        attributes: {
          name: string
          bio: string
        }
      }[]
    }
  }
}

type GetEventByIdQueryResponse = {
  event: {
    data: GetEventResponseCollection
  }
}

type EventProps = {
  event: GetEventResponseCollection
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<EventProps>> {
  const {data} = await client.query<GetEventByIdQueryResponse>({
    query: gql`
query GetEventById($id: ID) {
  event(id: $id) {
    data {
      id
      attributes {
        title
        when
        description
        location
        speakers {
          data {
            id
            attributes {
              name
              bio
            }
          }
        }
      }
    }
  }
}
    `,
    variables: {
      id: context.params?.id!
    },
  })

  return {
    props: {
      event: data.event.data,
    },
    revalidate: 30
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const {data} = await client.query<{ events: { data: { id: string }[] } }>({
    query: gql`
query {
  events {
    data {
      id
    }
  }
}
    `,
  })
  const paths = data.events.data.map((e) => "/" + e.id)
  return {
    paths,
    fallback: 'blocking'
  }
}

const restClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

const Event: NextPage<EventProps> = ({event}) => {
  const [subscription, setSubscription] = useState<string | null>(null)
  const {data: session, status} = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
    } else {
      setLoading(false)
    }
    if (session) {
      setLoading(true)
      restClient.get(`subscriptions?filters[$and][0][user][id][$eq]=${session?.id}&filters[$and][1][event][id][$eq]=${eventType.id}&populate[0]=event`, {
        headers: {
          Authorization: `Bearer ${session?.jwt}`,
        }
      })
        .then(response => {
          setSubscription(response.data.data.length > 0 ? response.data.data[0].id : null)
          setLoading(false)
        })
    }
  }, [session, status])

  const eventType: EventType = {
    id: event.id,
    title: event.attributes.title,
    when: new Date(event.attributes.when),
    description: event.attributes.description,
    location: event.attributes.location,
    speakers: event.attributes.speakers.data.map(s => ({
      id: s.id,
      name: s.attributes.name
    })),
  }

  const renderSpeakers = (speakers: { id: string, name: string }[]) => {
    const components = speakers.map((s, i) => (
      <span key={s.id}>
        <Link href={`/speakers/${s.id}`}>
          <a className="underline">{s.name}</a>
        </Link>
        {i === speakers.length - 1 ? '' : ' - '}
      </span>
    ))
    return components
  }

  const subscribe = () => {
    setLoading(true)
    fetch(`/api/subscribe/${event.id}`)
      .then(res => res.json())
      .then(data => {
        setSubscription(data.id)
        setLoading(false)
      })
  }

  const unsubscribe = () => {
    setLoading(true)
    fetch(`/api/unsubscribe/${subscription}`)
      .then(res => {
        setSubscription(null)
        setLoading(false)
      })
  }

  return (
    <div className="bg-white min-h-screen px-2">
      <Header title="Evento"/>
      <div>
        <h1 className="text-xl font-black font-bold mt-3">{eventType.title}</h1>
        <p className="font-semibold text-slate-500 mb-3">
          {renderSpeakers(eventType.speakers)}
        </p>
        <p className="flex items-center">
          <MapPin size={24}/>
          <span>{eventType.location}</span>
        </p>
        <p className="flex items-center mb-3">
          <Clock size={24}/>
          <span>{format(eventType.when, "dd' de 'MMMM' • 'HH'h'mm", {
            locale: ptBR
          })}</span>
        </p>
        <h2 className="text-xl font-black font-bold mt-8 mb-3">Descrição</h2>
        <p className="leading-7 mb-5">
          {eventType.description}
        </p>
      </div>
      {loading ? (
        <button
          className="mt-5 inline-block text-center bg-blue-500 hover:bg-blue-700 text-white py-2 rounded uppercase w-full font-bold disabled:bg-blue-300 disabled:text-blue-50"
          disabled={true}
        >
          Loading...
        </button>
      ) : (status === "authenticated" ?
        subscription ? (
          <button
            className="mt-5 inline-block text-center bg-red-500 hover:bg-red-700 text-white py-2 rounded uppercase w-full font-bold"
            onClick={unsubscribe}
          >
            desfazer inscrição
          </button>
        ) : (
          <button
            className="mt-5 inline-block text-center bg-blue-500 hover:bg-blue-700 text-white py-2 rounded uppercase w-full font-bold disabled:bg-blue-300 disabled:text-blue-50"
            onClick={subscribe}
          >
            Inscrever-se
          </button>
        )
        : (
          <Link href="/api/auth/signin">
            <a
              className="mt-5 inline-block text-center bg-blue-500 hover:bg-blue-700 text-white py-2 rounded uppercase w-full font-bold"
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}>
              Inscrever-se
            </a>
          </Link>
        ))}
    </div>
  )
}

export default Event
