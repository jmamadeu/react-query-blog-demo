import axios from 'axios'
import { queryCache, useMutation } from 'react-query'

export default function useSavePost() {
  return useMutation(
    (values) =>
      axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      onMutate: (newPost) => {
        queryCache.setQueryData(['posts', newPost.id], newPost)
      },
      onSuccess(post) {
        queryCache.setQueryData(['posts', post.id], post)

        if (!queryCache.getQueryData('posts')) {
          queryCache.setQueryData('posts', [post])
          queryCache.invalidateQueries('posts')

          return
        }

        queryCache.setQueryData('posts', (old) => {
          return old?.map((d) => (d.id === post.id ? post : d))
        })
      },
    }
  )
}
