import HttpException from '#models/HttpException';
import prisma from '#prisma';
import { UserInfo } from '#types/oidcType';

interface SetCommitBodyProps {
  iv: string;
  cipher: string;
  hmac: string;
  salt: string;
}

class CommitService {
  static async getList(user: UserInfo, data: { syncedAtFrom: string }) {
    const commits = await prisma.commit.findMany({
      where: {
        userId: user.sub,
        syncedAt: {
          gt: data.syncedAtFrom,
        },
      },
      orderBy: { syncedAt: 'asc' },
    });
    return commits;
  }

  static async getActualList(user: UserInfo, data: { syncedAtFrom: string }) {
    const lastCommitWithUnusedSalt = await prisma.commit.findFirst({
      where: { userId: user.sub, is_unused_salt: true },
      orderBy: { syncedAt: 'desc' },
    });

    if (!lastCommitWithUnusedSalt) return [];

    const commits = await prisma.commit.findMany({
      where: {
        userId: user.sub,
        salt: lastCommitWithUnusedSalt.salt,
        syncedAt: {
          gt: data.syncedAtFrom,
        },
      },
      orderBy: { syncedAt: 'asc' },
    });
    return commits;
  }

  static async create(user: UserInfo, data: SetCommitBodyProps) {
    const [commitWithSameSalt, lastCommitWithUnusedSalt] = await Promise.all([
      prisma.commit.findFirst({
        where: { userId: user.sub, salt: data.salt },
        orderBy: { syncedAt: 'desc' },
      }),
      prisma.commit.findFirst({
        where: { userId: user.sub, is_unused_salt: true },
        orderBy: { syncedAt: 'desc' },
      }),
    ]);

    if (!lastCommitWithUnusedSalt || !commitWithSameSalt) {
      // список коммитов пуст или нет коммитов с такой солью
      return prisma.commit.create({
        data: { ...data, userId: user.sub, is_unused_salt: true },
      });
    }

    if (lastCommitWithUnusedSalt.salt !== data.salt) {
      throw new HttpException(400, 'Irrelevant data. The page needs to be reloaded');
    }

    const commitWithSameHmac = await prisma.commit.findFirst({
      where: { userId: user.sub, hmac: data.hmac },
    });

    if (commitWithSameHmac) {
      return commitWithSameHmac;
    }

    return prisma.commit.create({
      data: { ...data, userId: user.sub, is_unused_salt: false },
    });
  }
}

export default CommitService;
