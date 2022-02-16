import React from "react";
import { Row, Col } from 'reactstrap';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Home from "./template/Home";
import Viewer from "./template/Viewer";
import logo from './public/logo.png'
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpIcon from '@mui/icons-material/Help';

import './App.scss'

export default function App() {
  return (
    <Router>
      <div className="App">
        <Row className="Header">
          <Col md="2" id="logo">
            <Link to="/">
              <img src={'/static'+ logo} alt="Curate" />
            </Link>
          </Col>
          <Col md="1" />
          <Col md="3" id="title" className="align-self-center">
              <div><h1>CURATE</h1></div>
              <div><h4 >Schema Curation Interface</h4></div>
          </Col>
          <Col md="5" className="align-self-center">
            <Row>
              <Col md="1" />
              <Col md="3" className="nav-items">
                <Link to="/viewer">Viewer</Link>
              </Col>
              <Col md="1" className="nav-items">
                <a target="_blank" href="https://github.com/cu-clear/schema-interface">
                  <GitHubIcon />
                </a>
              </Col>
              <Col md="1" className="nav-items">
                <a target="_blank" href="https://chrysographes.notion.site/Schema-Curation-Manual-c17f79c7450246d3ad7796e43bebea1b">
                  <HelpIcon />
                </a>
              </Col>
            </Row>
          </Col>
        </Row>

        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route exact path="/viewer" element={<Viewer />} />
        </Routes>
      </div>
    </Router>
  );
}