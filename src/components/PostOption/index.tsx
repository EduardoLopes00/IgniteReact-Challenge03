
import { FiCalendar, FiUser } from 'react-icons/fi'
import styles from './styles.module.scss';

interface PostOptionProps {
    post: {
        slug?: string;
        first_publication_date: string | null;
        data: {
          title: string;
          subtitle: string;
          author: string;
        };
    }
}

export default function PostOption({ post }: PostOptionProps) {
    const iconSize = "20px";
    console.log(post)

    return (
      <div className={styles.container}>
        <h3>{post.data.title}</h3>
        <p>{ post.data.subtitle }</p>
        <div>
          <FiCalendar 
            color="#BBBBBB"
            className={styles.postListIcon}
            size={iconSize}
          />
          <time>{post.first_publication_date}</time>
          <FiUser 
            color = "#BBBBBB"
            className={styles.postListIcon}
            size={iconSize}

          />
          <span>{post.data.author}</span>
        </div>
      </div>  
    )
}