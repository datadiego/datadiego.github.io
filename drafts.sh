grep -r "draft: true" content/posts/ | sed -E 's#content/posts/([^/]+)/.*#\1#'
