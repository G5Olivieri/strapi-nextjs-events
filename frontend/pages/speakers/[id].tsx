import type {GetStaticPropsContext, GetStaticPropsResult, NextPage} from 'next'
import {GetStaticPathsResult} from "next";
import gql from "graphql-tag";
import client from "../../apollo-client";
import Header from "../../components/header";

type GetSpeakerResponseCollection = {
  id: string
  attributes: {
    name: string
    bio: string
  }
}

type GetSpeakerByIdQueryResponse = {
  speaker: {
    data: GetSpeakerResponseCollection
  }
}

type EventProps = {
  speaker: GetSpeakerResponseCollection
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<EventProps>> {
  const {data} = await client.query<GetSpeakerByIdQueryResponse>({
    query: gql`
query GetSpeakerById($id: ID) {
  speaker(id: $id) {
    data {
      id
      attributes {
        name
        bio
      }
    }
  }
}
    `,
    variables: {
      id: context.params?.id!
    }
  })

  return {
    props: {
      speaker: data.speaker.data
    },
    revalidate: 60
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const {data} = await client.query<{ speakers: { data: { id: string }[] } }>({
    query: gql`
    query {
      speakers {
        data {
          id
        }
      }
    }
    `
  })

  const paths = data.speakers.data.map(s => ({params: {id: s.id}}))
  return {
    paths,
    fallback: true
  }
}

const Speaker: NextPage<EventProps> = ({speaker}) => {

  return (
    <div className="bg-white min-h-screen px-2">
      <Header title='Palestrante'/>
      <div>
        <h1>
          {speaker.id}
        </h1>
        <p>{speaker.attributes.name}</p>
        <p>{speaker.attributes.bio}</p>
      </div>
    </div>
  )
}

export default Speaker
