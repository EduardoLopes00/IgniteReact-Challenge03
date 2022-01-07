import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Prismic from '@prismicio/client'
import { FiCalendar, FiUser } from 'react-icons/fi'
import { RichText } from 'prismic-dom';
import PostOption from '../components/PostOption';
import { useState } from 'react';

type Post = {
  slug?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  posts: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}


export default function Home( { postsPagination }: HomeProps ) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.posts)

  return (
    <>
      <main className={styles.container}>
        <div className={styles.content}>
         
          {posts.map(post =>  (
            <PostOption key = {post.slug} post={post}/>
            )
          )}
          
          
          <strong>Carregar mais posts</strong>


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

  const posts: Post[] = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })

  return { 
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        posts,
        
      }      
    }
  }

}