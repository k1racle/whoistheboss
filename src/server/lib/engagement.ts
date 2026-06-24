import { prisma } from './prisma.js';

export type EntityType = 'INTERVIEW' | 'ARTICLE' | 'REEL' | 'ENTREPRENEUR';

export async function getEngagement(
  entityType: EntityType,
  entityId: string,
  userId?: string | null
) {
  const [likeCount, shareCount, userLike] = await Promise.all([
    prisma.like.count({ where: { entityType, entityId } }),
    prisma.shareEvent.count({ where: { entityType, entityId } }),
    userId
      ? prisma.like.findUnique({
          where: {
            userId_entityType_entityId: {
              userId,
              entityType,
              entityId,
            },
          },
        })
      : null,
  ]);

  return {
    likeCount,
    shareCount,
    userLiked: !!userLike,
  };
}
