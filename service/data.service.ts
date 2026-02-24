import { prisma } from '../utils.server'

import TurndownService from 'turndown'
import { statService } from './stat.service'
const turndownService = new TurndownService()

export type DataSchema = {
  pages: Array<{
    uniqueId: string
    pageId: string
    url?: string
    title?: string
  }>
  comments: Array<{
    id: string
    content: string
    createdAt: string
    by_nickname: string
    by_email?: string
    pageUniqueId: string
    parentId: string
  }>
}

export class DataService {
  // Função desativada para remover dependência do xml2json
  disqusAdapter(xmlData: string): DataSchema {
    return {
      pages: [],
      comments: []
    }
  }

  async import(projectId: string, schema: DataSchema) {
    const pages = await prisma.$transaction(
      schema.pages.map((thread) => {
        return prisma.page.upsert({
          where: {
            id: thread.uniqueId,
          },
          create: {
            id: thread.uniqueId,
            projectId,
            slug: thread.pageId,
            url: thread.url,
            title: thread.title,
          },
          update: {},
        })
      }),
    )

    const upsertedPosts = await prisma.$transaction(
      schema.comments.map((post) => {
        return prisma.comment.upsert({
          where: {
            id: post.id,
          },
          create: {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            by_nickname: post.by_nickname,
            pageId: post.pageUniqueId,
            parentId: post.parentId,
          },
          update: {},
        })
      }),
    )

    return {
      threads: pages,
      posts: upsertedPosts
    }
  }

  // Função desativada para remover dependência do xml2json
  async importFromDisqus(projectId: string, xmlData: string) {
    return {
      threads: [],
      posts: []
    }
  }
}
