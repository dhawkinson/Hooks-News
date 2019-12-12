import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import FirebaseContext from '../../firebase/context'
import { getDomain } from '../../utils'

function LinkItem({ link, index, showCount, history}) {
  const { firebase, user } = React.useContext(FirebaseContext);

  function handleVote() {
    if (!user) {
      // user not authenticated - route to login
      history.push('/login');
    } else {
      // user authenticated - allow upvote
      // *** the following block is a standard firebase update pattern ***
      const voteRef = firebase.db.collection('links').doc(link.id); //  declare to document reference
      // use the reference to get the document
      voteRef.get().then(doc => {
        if (doc.exists) {
          // get the previous vote
          const previousVotes = doc.data().votes;
          // new vote
          const vote = {
            votedBy: {
              id: user.uid,
              name: user.displayName
            }
          };
          // set an updated vote count
          const updatedVotes = [...previousVotes, vote]
          const voteCount = updatedVotes.length
          // update the document
          voteRef.update({ votes: updatedVotes, voteCount });
        }
      });
    }
  }

  function handleDeleteLink() {
    // *** the following block is a standard firebase delete pattern ***
    const linkRef = firebase.db.collection('links').doc(link.id); //  declare the document reference
    // delete the reference
    linkRef
      .delete()
      .then(() => {
        console.log(`Document with ID ${link.id} deleted`)
      })
      .catch(err => {
      console.error('Error deleting document:', err)
      })
  }

  const postedByAuthUser = user && user.uid === link.postedBy.id
  return ( 
    <div className='flex items-start mt2'>
      <div className='flex items-center'> 
        {showCount && <span className = 'gray' >{index}.</span>} 
        <div className='vote-button' onClick={handleVote}>
          ▲
        </div> 
      </div> 
      <div className='ml1'>
        <div> 
          <a href={link.url} className='black no-underline'>{link.description}</a>{' '} 
          <span className='link'>({getDomain(link.url)})</span> 
        </div> 
        <div className = 'f6 lh-copy gray'> 
          {link.voteCount} votes by {link.postedBy.name}{' '} 
          {formatDistanceToNow(link.created)} 
          {' | '} 
          <Link to={`/link/${link.id}`}> 
            {link.comments.length > 0
              ? `${link.comments.length} comments`
              : 'Discuss'} 
          </Link>
          {postedByAuthUser && (
            <>
              {' | '}
              <span className='delete-button' onClick={handleDeleteLink}>
                Delete
              </span>
            </>
          )}
        </div> 
      </div> 
    </div>
  );
}

export default withRouter(LinkItem);