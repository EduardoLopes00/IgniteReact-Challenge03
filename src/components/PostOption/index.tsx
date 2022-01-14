
import { FiCalendar, FiUser } from 'react-icons/fi'
import styles from './styles.module.scss';
import  Link  from 'next/link'
import { formatDate } from '../../shared/utils/utils';


type Post = {
    uid?: string;
    first_publication_date: string | null;
    data: {
      title: string;
      subtitle: string;
      author: string;
    };
  }

interface PostOptionProps {
    post: Post
}

export default function PostOption({ post }: PostOptionProps) {

    const iconSize = "20px";

    return (
      <div className={styles.container}>
        <Link href={`/post/${post.uid}`}>
            <a>
                <h3>{post.data?.title}</h3>
            </a>
        </Link>
        <p>{ post.data?.subtitle }</p>
        <div>
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
          <span>{post.data?.author}</span>
        </div>
      </div>  
    )
}