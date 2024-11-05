import { AppTheme } from '@lib/services/theme';

type StorageObjectMap = {
    appSession: {
        user: string;
        token: string;
    };
    appTheme: AppTheme;
};

export type StorageObjectType = 'appSession' | 'appTheme';

export type StorageObjectData<T extends StorageObjectType> = {
    type: T;
    data: StorageObjectMap[T];
};

export interface newTabData {
    dbName: string;
    tableName: string;
}

export interface TableInfo {
    db_name: string;
    table_name: string;
    columns: any[];
    indexes: any[];
    foreign_keys: any[];
    triggers: any[];
}
