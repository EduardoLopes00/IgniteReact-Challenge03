import { GetStaticPaths, GetStaticProps } from 'next';
import  Head  from 'next/head';
import { RichText } from 'prismic-dom';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'


import { getPrismicClient } from '../../services/prismic';
import { formatDate } from '../../shared/utils/utils';

import styles from './post.module.scss';

type StaticProps = {
  params: {
    slug: string;
  }
}
interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    timeToRead: string;
    content: {
      heading: string;
        body: string;
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}: PostProps) {
  const iconSize = "18px";



  return (
    <>
      <Head>
        <title>{post.data.title} | TechInovation</title>
      </Head>

      
      <main className={styles.container}>
        <img src={post.data.banner.url} alt="banner" />

        <article className={styles.post}>

          <h1>{post.data.title}</h1>

          <div className={styles.infoBox}>
            <FiCalendar 
              color="#BBBBBB"
              className={styles.postListIcon}
              size={iconSize}
            />
            <time>{formatDate(post.first_publication_date)}</time>
            <FiUser 
              color = "#BBBBBB"
              className={styles.postListIcon}
              size={iconSize}

            />
            <span>{post.data.author}</span>
            <FiClock 
              color = "#BBBBBB"
              className={styles.postListIcon}
              size={iconSize}
            />
            <span>{post.data.timeToRead} min</span>

          </div>

        
          
          {post.data.content.map(postContentFragment => (
            <>
              <h4>{postContentFragment.heading}</h4> 
                <div
                  className={styles.postContent}
                  dangerouslySetInnerHTML={ { __html: postContentFragment.body } }
                />

              </>
          ))}
          
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
      paths: [],
      fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({params}: StaticProps) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('publication', String(params.slug), {});
  
  const post: Post = { 
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      timeToRead: Math.ceil(response.data.content.reduce((acc, content) => {
          const headerWordsCount = content.heading.split(' ').length
          const contentWordsCount = RichText.asText(content.body).split(' ').length

          const resultNotRounded = (headerWordsCount + contentWordsCount) / 200
          
          return acc + resultNotRounded 
        }, 0)).toString(),
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: RichText.asHtml(content.body)
        }
    
      })
       
    }
  }


  return {
  
    props: {
      post
    }
  }
}

