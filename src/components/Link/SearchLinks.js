import React from 'react';
import LinkItem from './LinkItem';
import FirebaseContext from '../../firebase/context';

function SearchLinks() {
  const { firebase } = React.useContext(FirebaseContext);
  const [filteredLinks, setFilteredLinks] = React.useState([]);
  const [links, setLinks] = React.useState([]);
  const [filter, setFilter] = React.useState('')

  React.useEffect(() => {
    getInitialLinks();
  }, [])

  function getInitialLinks() {
    firebase.db
      .collection('links')
      .get()
      .then(snapshot => {
        const links = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
        setLinks(links);
      });
  }

  function handleSearch(event) {
    event.preventDefault();
    const query = filter.toLowerCase(); //  make the search easier in lower case
    // matchedLinks are those links that include the query string
    const matchedLinks = links.filter(link => {
      return (
        // if description includes query OR
        link.description.toLowerCase().includes(query) ||
        // if url includes query OR
        link.url.toLowerCase().includes(query) ||
        // if postedBy includes query
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    // set State with matchedLinks
    setFilteredLinks(matchedLinks);
  }

  return ( <
    div >
    <
    form onSubmit = {
      handleSearch
    } >
    <
    div >
    Search < input onChange = {
      event => setFilter(event.target.value)
    }
    /> <
    button > OK < /button> <
    /div> <
    /form> {
      /* map and render filteredLinks */ } {
      filteredLinks.map((filteredLink, index) => ( <
        LinkItem key = {
          filteredLink.id
        }
        showCount = {
          false
        }
        link = {
          filteredLink
        }
        index = {
          index
        }
        />
      ))
    } <
    /div>
  );
}

export default SearchLinks;