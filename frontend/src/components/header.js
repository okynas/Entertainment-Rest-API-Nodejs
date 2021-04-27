import {Helmet} from "react-helmet"
import {Link} from "react-router-dom"
import styled from "styled-components"


function Header(props) {
  const Header = styled.header`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 200px;
  `;

  const LeftSide = styled.section``;
  const RightSide = styled.section``;

  const UnorderedList = styled.ul`
    display: flex;
    flex-direction: row;
  `;

  const ListElement = styled.li`
    list-style-type: none;
    margin: 1rem;
  `;

  return (
    <>
      <Helmet>
        {props.title ?
          <title>{props.title} | 0xYnas</title>
          :
          <title>0kYnas</title>
        }
        <link rel="canonical" href="http://mysite.com/example"/>
      </Helmet>
      <Header>
        <LeftSide>
          <h2>0xYnas</h2>
        </LeftSide>
        <RightSide>
          <nav>
            <UnorderedList>
              <ListElement>
                <Link to="/">Home</Link>
              </ListElement>
              {/* <ListElement>
                <Link to="/about">About</Link>
              </ListElement>
              <ListElement>
                <Link to="/etater">Projects</Link>
              </ListElement> */}
            </UnorderedList>
          </nav>
        </RightSide>
      </Header>
    </>
  );
}

export default Header;
