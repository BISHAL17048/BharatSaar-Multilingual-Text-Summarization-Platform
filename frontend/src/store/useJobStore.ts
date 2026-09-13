import { create } from "zustand";
import { IJob } from "../types/document";

interface JobState {
    activeJob: IJob | null;
    setActiveJob: (job: IJob) => void;
    updateProgress: (percentage: number, stage: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
    activeJob: null,
    setActiveJob: (job) => set({ activeJob: job }),
    updateProgress: (percentage, stage) => set((state) => ({
        activeJob: state.activeJob ? { ...state.activeJob, progressPercentage: percentage, currentStage: stage } : null
    })),
}));
