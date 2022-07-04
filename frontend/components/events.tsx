import {Clock, MapPin} from "phosphor-react";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";
import Link from "next/link";

export type EventType = {
  id: string
  title: string
  description: string
  when: Date
  location: string
  speakers: {
    id: string
    name: string
  }[]
}

type EventProps = {
  event: EventType
}

const Event: React.FC<EventProps> = ({event}) => {
  return (
    <Link href={`/${event.id}`}>
      <div
        className="flex-col py-8 px-8 bg-white rounded-xl shadow-md">
        <h2 className="text-lg font-bold underline line-clamp-1">
          {event.title}
        </h2>
        <p className="font-bold text-slate-500 line-clamp-2">
          {event.speakers.map(s => s.name).join(' - ')}
        </p>
        <p className="line-clamp-3">
          {event.description}
        </p>
        <p className="flex items-center text-slate-500 justify-end mt-2 gap-1">
          <Clock size={24}/>
          <span>{format(event.when, "dd' de 'MMMM' • 'HH'h'mm", {
            locale: ptBR
          })}</span>
        </p>
      </div>
    </Link>
  )
}

type EventsProps = {
  events: EventType[]
}

const Events: React.FC<EventsProps> = ({events}) => {
  return (
    <ul className="m-2">
      {events.map(e => (
        <li className="m-2" key={e.id}><Event event={e}/></li>
      ))}
    </ul>
  )
}

export default Events
