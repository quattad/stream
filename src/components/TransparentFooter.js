/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

function TransparentFooter() {
  return (
    <footer className="footer">
      <Container>
        <div className="copyright" id="copyright">
          © {new Date().getFullYear()}.
          Built by Jonathan Quah / {" "}
          <a
            href="https://quattad.github.io/"
            target="_blank"
          >
            Quattad
          </a>
          .
        </div>
      </Container>
    </footer>
  );
}

export default TransparentFooter;