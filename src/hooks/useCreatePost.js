import axios from 'axios'
import { queryCache, useMutation } from 'react-query'

export default function useCreatePost() {
  return useMutation(
    (values) => axios.post('/api/posts', values).then((res) => res.data),
    {
      onMutate: (newPost) => {
        const oldPosts = queryCache.getQueryData('posts')

        if (oldPosts) {
          queryCache.setQueryData('posts', (old) => [...old, newPost])
        }

        return () => oldPosts
      },
      onError: (error, newPost, rollback) => {
        if (rollback) rollback()
      },
      onSettled: () => {
        queryCache.invalidateQueries('posts')
      },
    }
  )
}
