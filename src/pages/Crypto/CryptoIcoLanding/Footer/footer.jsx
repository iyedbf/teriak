import React from "react"
import { Container, Row, Col } from "reactstrap"
import { Link } from "react-router-dom"

//Import Components
import FooterLink from "./footer-link"

const Features = () => {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { title: "About Us", link: "#" },
        { title: "Features", link: "#" },
        { title: "Team", link: "#" },
        { title: "News", link: "#" },
        { title: "FAQs", link: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { title: "Whitepaper", link: "#" },
        { title: "Token sales", link: "#" },
        { title: "Privacy Policy", link: "#" },
        { title: "Terms & Conditions", link: "#" },
      ],
    },
    {
      title: "Links",
      links: [
        { title: "Tokens", link: "#" },
        { title: "Roadmap", link: "#" },
        { title: "FAQs", link: "#" },
      ],
    },
  ]

  return (
    <React.Fragment>
      
    </React.Fragment>
  )
}

export default Features
