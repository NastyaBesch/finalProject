import React, { Component } from "react";
import { Link } from "react-router-dom";
import classes from "./header.module.css";

class Header extends Component {
  render() {
    const { nav } = this.props;

    return (
      <header dir="rtl">
        {/* <nav className="nav"></nav> */}
        <nav>
          <ul
            className="ant-menu-overflow
            ant-menu
            ant-menu-root
            ant-menu-horizontal
            ant-menu-dark
            css-dev-only-do-not-override-ed5zg0"
          >
            {nav.map((item) => (
              <li
                className="ant-menu-overflow-item
                ant-menu-item
                ant-menu-item-only-child" key={item.link}  
              >
                <Link to={item.link}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
