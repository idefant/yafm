import { Router } from 'express';

import CommitController from '../controllers/CommitController';
import { body, query } from '../middlewares/checkRequestMiddleware';
import { verifyJwtMiddleware } from '../middlewares/verifyJwtMiddleware';
import { createCommitSchema, getListCommitsSchema } from '../schema/commitSchema';

const router = Router();

router.use(verifyJwtMiddleware);

/**
 * @openapi
 * components:
 *   schemas:
 *     Commit:
 *       type: object
 *       required:
 *         - id
 *         - cipher
 *         - iv
 *         - hmac
 *         - salt
 *         - userId
 *         - syncedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         cipher:
 *           type: string
 *         iv:
 *           type: string
 *         hmac:
 *           type: string
 *         salt:
 *           type: string
 *         userId:
 *           type: string
 *           format: uuid
 *         syncedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCommit:
 *       type: object
 *       required:
 *         - cipher
 *         - iv
 *         - hmac
 *         - salt
 *       properties:
 *         cipher:
 *           type: string
 *         iv:
 *           type: string
 *         hmac:
 *           type: string
 *         salt:
 *           type: string
 */

/**
 * @openapi
 * /commit:
 *   get:
 *     tags:
 *       - Commit
 *     summary: Commit list
 *     parameters:
 *      - name: syncedAtFrom
 *        in: query
 *        format: date-time
 *        example: 2017-07-21T17:32:28Z
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commit'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HttpException'
 */
router.get('/', query(getListCommitsSchema), CommitController.getList);

/**
 * @openapi
 * /commit/actual:
 *   get:
 *     tags:
 *       - Commit
 *     summary: Actual commit list
 *     parameters:
 *      - name: syncedAtFrom
 *        in: query
 *        format: date-time
 *        example: 2017-07-21T17:32:28Z
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commit'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HttpException'
 */
router.get('/actual', query(getListCommitsSchema), CommitController.getActualList);

/**
 * @openapi
 * /commit:
 *   post:
 *     tags:
 *       - Commit
 *     summary: Create commit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommit'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commit'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HttpException'
 */
router.post('/', body(createCommitSchema), CommitController.create);

export default router;
