import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';
import Prismic from '@prismicio/client'
import PostOption from '../components/PostOption';
import { useState } from 'react';
import axios from "axios";
import { postOptionAdapter } from '../shared/adapters/postOption';

type Post = {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

type PostResponse = {
  next_page: string;
  
  results: Post[]
  
}


interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}


export default function Home( { postsPagination }: HomeProps ) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results)
  const [nextPage, setNextPage] = useState<string>(postsPagination.next_page)


  async function handleLoadMorePost() {
    const response = await (await fetch(nextPage)).json() as PostResponse

    setPosts([...posts, ...response.results])
    setNextPage(response.next_page)
  }

  return (
    <>
      <main className={styles.container}>
        <div className={styles.content}>
          
        {postsPagination.results ?    
            
            <>
              {posts.map(post => 
              
                <PostOption key = {post.uid} post={post}/>
                
              )}
        
              {nextPage ?    
                <strong onClick={handleLoadMorePost}>Carregar mais posts</strong>
                : 
                null
              }
            </>

          : 
            <h1>Ainda não existem posts publicados no blog.</h1>
            
        }
          
        </div>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      fetch: ['publication.title',
              'publication.subtitle',
              'publication.author'],
      pageSize: 2
    }
  );

  const results: Post[] = postsResponse.results.map(post => {
  
    return postOptionAdapter(post);
  })

  return { 
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results,
        
      }      
    }
  }

}