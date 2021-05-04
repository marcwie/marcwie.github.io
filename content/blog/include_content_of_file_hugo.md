---
title: "Include code from external file in a hugo blog post"
slug: "external-text-hugo-blog-post"
date: 2021-05-04T14:46:12+02:00
draft: false
---

I am creating my personal webpage (i.e., this site) with [hugo](https://gohugo.io/) and sometimes include code blocks (e.g., javascript) into my posts. One obvious way to achieve this is copying the code directly into the corresponding markdown file. However, since I may adjust this code in the future but still want my blog post to show the most recent version, I was looking for a solution that allows me to import the code as a block of text into the markdown file.

I found a [corresponding topic](https://discourse.gohugo.io/t/include-external-code-to-posts/1379) in the hugo discourse forum that suggests to use the following shortcode:

```html
{{ $file := .Get "file" | readFile }}
{{ $lang := .Get "language" }}
{{ (print "```" $lang "\n" $file "\n```") | markdownify }}
```
Assuming that we named the corresponding file `code.html`, this shortcode can then be used with the following command:
```html
{{%/* code file="/static/some-script.js" language="js" */%}}
```
The problem is that this solution relies on hugo's `markdownify` which appears to cause problems if the code to be imported contains multiple blocks (i.e., empty lines).

After searching around on the web I found a much simpler solution which is to use the following shortcode (let's name it `include.html`) and put it into your `layouts/shortcodes` folder:
```html {{% include "/layouts/shortcodes/include.html" %}}
```
You can then simply use
```html
{{%/* include "/static/some-script.js" */%}}
```
and the content of `static/some-script.js` should appear well-rendered in your blog-post.







