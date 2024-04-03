export interface DreamData {
    id: string;
    title: string,
    text: string;
    isLucid: boolean;
    isNightmare: boolean;
    isChecked: boolean;
    apiInfo: {
        conceptList: string[];
        entitiesList: string[];
    };
    date: string;
}