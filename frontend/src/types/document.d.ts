export interface IDocument {
    id: string;
    originalName: string;
    sourceType: "TXT" | "PDF" | "URL" | "YOUTUBE";
    createdAt: string;
}

export interface IEntity {
    text: string;
    label: string;
    start: number;
    end: number;
}

export interface ITopic {
    topic: string;
    score: number;
}

export interface IJob {
    id: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    currentStage: string;
    progressPercentage: number;
}

export interface IIntelligence {
    headline: string;
    detailedSummary: string;
    bulletSummary: string;
    entities: IEntity[];
    keywords: string[];
    topics: ITopic[];
}
