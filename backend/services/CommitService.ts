import HttpException from '../models/HttpException';
import prisma from '../prisma';
import { Token } from '../types/tokenType';

interface SetCommitBodyProps {
  iv: string;
  cipher: string;
  hmac: string;
  salt: string;
}

class CommitService {
  static async getList(token: Token, data: { syncedAtFrom: string }) {
    const commits = await prisma.commit.findMany({
      where: {
        userId: token.sub,
        syncedAt: {
          gt: data.syncedAtFrom,
        },
      },
      orderBy: { syncedAt: 'asc' },
    });
    return commits;
  }

  static async getActualList(token: Token, data: { syncedAtFrom: string }) {
    const lastCommitWithUnusedSalt = await prisma.commit.findFirst({
      where: { userId: token.sub, is_unused_salt: true },
      orderBy: { syncedAt: 'desc' },
    });

    if (!lastCommitWithUnusedSalt) return [];

    const commits = await prisma.commit.findMany({
      where: {
        userId: token.sub,
        salt: lastCommitWithUnusedSalt.salt,
        syncedAt: {
          gt: data.syncedAtFrom,
        },
      },
      orderBy: { syncedAt: 'asc' },
    });
    return commits;
  }

  static async create(token: Token, data: SetCommitBodyProps) {
    const [commitWithSameSalt, lastCommitWithUnusedSalt] = await Promise.all([
      prisma.commit.findFirst({
        where: { userId: token.sub, salt: data.salt },
        orderBy: { syncedAt: 'desc' },
      }),
      prisma.commit.findFirst({
        where: { userId: token.sub, is_unused_salt: true },
        orderBy: { syncedAt: 'desc' },
      }),
    ]);

    if (!lastCommitWithUnusedSalt || !commitWithSameSalt) {
      // список коммитов пуст или нет коммитов с такой солью
      return prisma.commit.create({
        data: { ...data, userId: token.sub, is_unused_salt: true },
      });
    }

    if (lastCommitWithUnusedSalt.salt !== data.salt) {
      throw new HttpException(400, 'Irrelevant data. The page needs to be reloaded');
    }

    const commitWithSameHmac = await prisma.commit.findFirst({
      where: { userId: token.sub, hmac: data.hmac },
    });

    if (commitWithSameHmac) {
      return commitWithSameHmac;
    }

    return prisma.commit.create({
      data: { ...data, userId: token.sub, is_unused_salt: false },
    });
  }
}

export default CommitService;
