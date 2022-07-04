import type {GetServerSidePropsContext, GetServerSidePropsResult, NextPage} from 'next'
import client from "../apollo-client";
import gql from "graphql-tag";
import {getSession} from "next-auth/react";
import Events, {EventType} from "../components/events";
import Header from "../components/header";

type GetEventsQueryResponse = {
  subscriptions: {
    data: {
      attributes: {
        event: {
          data: {
            id: string
            attributes: {
              title: string
              description: string
              when: string
              location: string
              speakers: {
                data: {
                  id: string
                  attributes: {
                    name: string
                  }
                }[]
              }
            }
          }
        }
      }
    }[]
  }
}

type EventsProps = {
  events: EventType[]
}

export async function getServerSideProps({req}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<EventsProps>> {
  const session = await getSession({req})
  if (!session) {
    return {
      redirect: {
        statusCode: 301,
        destination: '/'
      },
    }
  }
  const {data} = await client.query<GetEventsQueryResponse>({
    query: gql`
query GetSubscriptions($id: ID){
  subscriptions(filters:{user: {id: { eq: $id }}}) {
    data {
      attributes {
        event {
          data {
            id
            attributes {
              title
              description
              when
              location
              speakers {
                data {
                  id
                  attributes {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `,
    variables: {
      id: session.id
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        authorization: `Bearer ${session.jwt}`
      }
    }
  })
  return {
    props: {
      events: data.subscriptions.data.map(d => {
          const e = d.attributes.event.data
          return {
            id: e.id,
            title: e.attributes.title,
            when: e.attributes.when as unknown as Date,
            description: e.attributes.description,
            location: e.attributes.location,
            speakers: e.attributes.speakers.data.map(s => ({
              id: s.id,
              name: s.attributes.name
            }))
          }
        }
      ),
    },
  }
}

const MyEvents: NextPage<EventsProps> = ({events}) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="Meus eventos" />
      <Events events={events.map(e => ({...e, when: new Date(e.when)}))} />
    </div>
  )
}

export default MyEvents
