import type {NextPage} from 'next'
import {GetStaticPropsContext, GetStaticPropsResult} from "next";
import Events, {EventType} from "../components/events";
import Header from "../components/header";
import client from "../apollo-client";
import gql from "graphql-tag";

type GetEventsResponseCollection = {
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

type GetEventsQueryResponse = {
  events: {
    data: GetEventsResponseCollection[]
  }
}

type EventsProps = {
  events: GetEventsResponseCollection[]
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<EventsProps>> {
  const {data} = await client.query<GetEventsQueryResponse>({
    query: gql`
    query {
      events(sort: ["when"]) {
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
    `
  })
  return {
    props: {
      events: data.events.data
    },
    revalidate: 10
  }
}

const Home: NextPage<EventsProps> = ({events}) => {
  const es: EventType[] = events.map(e => ({
    id: e.id,
    title: e.attributes.title,
    when: new Date(e.attributes.when),
    description: e.attributes.description,
    location: e.attributes.location,
    speakers: e.attributes.speakers.data.map(s => ({
      id: s.id,
      name: s.attributes.name
    })),
  }))

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="Eventos" />
      <Events events={es}/>
    </div>
  )
}

export default Home
