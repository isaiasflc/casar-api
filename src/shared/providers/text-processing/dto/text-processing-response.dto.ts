export enum TextProcessingSentimentEnum {
    NEG = 'neg',
    POS = 'pos',
    NEUTRAL = 'neutral'
}

type Probability = {
    neg: string,
    pos: string,
    neutral: string,
}

export type PostTextProcessingSentimentResponse = {
    probability: Probability,
    label: TextProcessingSentimentEnum,
};