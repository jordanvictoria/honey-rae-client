import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isStaff } from "../../utils/isStaff"
import { TicketCard } from "./TicketCard"
import { getAllTickets, searchTicketsByStatus, searchTickets } from "../../managers/TicketManager"
import "./Tickets.css"

export const TicketList = () => {
  const [active, setActive] = useState("")
  const [tickets, setTickets] = useState([])
  const [searchedTerm, setTerm] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    getAllTickets().then((res) => setTickets(res))
  }, [])

  useEffect(() => {
    const activeTicketCount = tickets.filter(t => t.date_completed === null).length
    if (isStaff()) {
      setActive(`There are ${activeTicketCount} open tickets`)
    }
    else {
      setActive(`You have ${activeTicketCount} open tickets`)
    }
  }, [tickets])

  useEffect(() => {
    if (searchedTerm) {
      searchTickets(searchedTerm)
      .then(ticketsData => setTickets(ticketsData))
    } else {
      setTickets(tickets)
    }
  }, [searchedTerm])


  const toShowSearchInput = () => {
    if (isStaff()) {
      return <input className="input is-primary" type="text" placeholder="Search" onKeyUp={
        (event) => {
          const searchTerm = event.target.value
          setTerm(searchTerm)
        }
      } />
    } else {
      return ""
    }
  }

  const toShowOrNotToShowTheButton = () => {
    if (isStaff()) {
      return ""
    }
    else {
      return <button className="actions__create"
        onClick={() => navigate("/tickets/create")}>Create Ticket</button>
    }
  }

  const filterTickets = (status) => {
    searchTicketsByStatus(status).then((res) => setTickets(res))
  }

  return <>
    <div>
      <button onClick={() => filterTickets("done")}>Show Done</button>
      <button onClick={() => filterTickets("unclaimed")}>Show Unclaimed</button>
      <button onClick={() => filterTickets("inprogress")}>Show In Progress</button>
      <button onClick={() => filterTickets("all")}>Show All</button>
    </div>
    <div>
      {toShowSearchInput()}
    </div>
    <div className="actions">{toShowOrNotToShowTheButton()}</div>
    <div className="activeTickets">{active}</div>
    <article className="tickets">
      {
        tickets.map(ticket => (
          <TicketCard key={`ticket--${ticket.id}`} ticket={ticket} />
        ))
      }
    </article>
  </>
}
