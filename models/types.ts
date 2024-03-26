export interface DreamData {
    text: string;
    isLucid: boolean;
    apiInfo: {
        conceptList: string[];
        entitiesList: string[];
    };
}