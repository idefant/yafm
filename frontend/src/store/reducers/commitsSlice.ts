import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';

import { commitSchema } from '#schema/commitSchema';

type CommitsState = {
  commits: z.infer<typeof commitSchema>[];
};

const initialState: CommitsState = {
  commits: [],
};

export const commitsSlice = createSlice({
  name: 'commit',
  initialState,
  reducers: {
    addCommit(state, { payload: commit }: PayloadAction<z.infer<typeof commitSchema>>) {
      state.commits.push(commit);
    },
    setCommits(state, { payload: commits }: PayloadAction<z.infer<typeof commitSchema>[]>) {
      state.commits = commits;
    },
    clearCommits(state) {
      state.commits = [];
    },
  },
});

export const { addCommit, setCommits, clearCommits } = commitsSlice.actions;

export default commitsSlice.reducer;
