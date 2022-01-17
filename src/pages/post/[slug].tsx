import { GetStaticPaths, GetStaticProps } from 'next';
import  Head  from 'next/head';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router'

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'
import Prismic from '@prismicio/client'


import { getPrismicClient } from '../../services/prismic';
import { formatDate } from '../../shared/utils/utils';

import styles from './post.module.scss';

type StaticProps = {
  params: {
    slug: string;
  }
}

interface PostContent {
  body: {
    type: string;
    text: string;
    spans: {
      start: string,
      end: string,
      type: string
    }[];  
        
  }[];
  heading: string;
}
interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: PostContent[];
  };
}

interface PostProps {
  post: Post;
}

function calculateTimeToRead(postContent: PostContent[]): string {
    
  const result = Math.ceil(postContent.reduce((acc, content) => {
    const headerWordsCount = content.heading.split(' ').length
    const contentWordsCount = RichText.asText(content.body).split(' ').length

    const resultNotRounded = (headerWordsCount + contentWordsCount) / 200
    
    return acc + resultNotRounded 
  }, 0)).toString()

  return result;

}

export default function Post({post}: PostProps) {
  const iconSize = "18px";

  const router = useRouter();

  const test = true;

  if (router.isFallback) {
    return (

      <main className={styles.container}>
        
          
        <article className={styles.post}>
          <h1 className={styles.fallBackMessage}>Carregando...</h1>
        </article>


      </main>
    )
  }


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
            <span>{calculateTimeToRead(post.data.content)} min</span>

          </div>

        
          
          {post.data.content.map((postContentFragment, index) => (
            <>
              <h4 key = {index}>{postContentFragment.heading}</h4> 
                <div
                  className={styles.postContent}
                  dangerouslySetInnerHTML={ { __html: RichText.asHtml(postContentFragment.body) } }
                />

              </>
          ))}
          
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();


  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'publication'),
    { lang: '*' }
  );
  return {
    paths: posts.results.map((post) => {
      return { 
        params: { 
          slug: post.uid 
        }
      };
    }),
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async ({params}: StaticProps) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('publication', String(params.slug), {}) as Post;
  

  
  const post: Post = { 
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content
    }
  }
  
  return {
  
    props: {
      post
    }
  }
}

