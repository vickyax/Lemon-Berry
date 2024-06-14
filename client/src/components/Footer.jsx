import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footercopy">
          <h3>Developed by Vickyaxo ❤</h3>
        </Col>
        <Col md="4" className="footercopy">
          <h3>Copyright © {year}</h3>
        </Col>
        <Col md="4" className="footerbody">
          <ul className="footericons">
            <li className="social">
              <a
                href="https://github.com"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <AiFillGithub />
              </a>
            </li>
            <li className="social">
              <a
                href="https://twitter.com"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <AiOutlineTwitter />
              </a>
            </li>
            <li className="social">
              <a
                href="https://www.linkedin.com/in"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </li>
            <li className="social">
              <a
                href="https://www.instagram.com"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <AiFillInstagram />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
