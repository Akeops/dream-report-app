export interface DreamData {
    id: string;
    text: string;
    isLucid: boolean;
    isChecked: boolean;
    apiInfo: {
        conceptList: string[];
        entitiesList: string[];
    };
}