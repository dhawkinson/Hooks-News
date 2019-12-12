/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import axios from 'axios'

import FirebaseContext from '../../firebase/context'
import LinkItem from "./LinkItem";
import { LINKS_PER_PAGE } from '../../utils'


function LinkList(props) {
  const {
    firebase
  } = React.useContext(FirebaseContext)
  const [links, setLinks] = React.useState([]);
  const [cursor, setCursor] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const isNewPage = props.location.pathname.includes('new')
  const isTopPage = props.location.pathname.includes('top')
  const page = Number(props.match.params.page);
  const linksRef = firebase.db.collection('links')


  React.useEffect(() => {
    const unsubscribe = getLinks()
    return () => unsubscribe()
  }, [isTopPage, page])

  function getLinks() {
    const hasCursor = Boolean(cursor)
    setLoading(true)
    if (isTopPage) {
      return linksRef
        // Note: this is sorted in descending order by created date. This is the default sort.
        .orderBy('voteCount', 'desc') // Note: this is an optional clause, without it the order is FIFO
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else if ( page === 1 ){
        return linksRef
          .orderBy("created", "desc")
          .limit(LINKS_PER_PAGE)
          .onSnapshot(handleSnapshot)
    } else if (hasCursor) {
        return linksRef
          .orderBy("created", "desc")
          .startAfter(cursor.created)
          .limit(LINKS_PER_PAGE)
          .onSnapshot(handleSnapshot);
    } else {
      const offset = page * LINKS_PER_PAGE - LINKS_PER_PAGE
      axios.get(`https://us-central1-hooksnewstutorial.cloudfunctions.net/linksPagination?offset=${offset}`)
        .then(response => {
          const links = response.data
          const lastLink = links[links.length - 1]
          setLinks(links)
          setCursor(lastLink)
          setLoading(false)
        })
      return () => {}
    }
  }

  function handleSnapshot(snapshot) {
    // use array map to iterate on links list - return the id and a spread (...) of the rest of the elements
    // *** the following block is a common firebase list pattern ***
    const links = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    setLinks(links);
    const lastLink = links[links.length - 1]
    setCursor(lastLink)
    setLoading(false)
  }

  function visitPreviousPage() {
    if (page > 1) {
      props.history.push(`/new/${page - 1}`);
    }
  }

  function visitNextPage() {
    if (page <= links.length / LINKS_PER_PAGE) {
      props.history.push(`/new/${page + 1}`);
    }
  }

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 0;

  return (
    <div style={{ opacity: loading ? 0.25 : 1 }}>
      {links.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + pageIndex}
        />
      ))}
      {isNewPage && (
        <div className='pagination'>
          <div className='pointer mr2' onClick={visitPreviousPage}>Previous</div>
          <div classname='pointer' onClick={visitNextPage}>Next</div>
        </div>
      )}
    </div>
  );

}

export default LinkList;