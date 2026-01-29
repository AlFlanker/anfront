import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {DocumentParams, DocumentsPageResponse, Scope} from '../models/types';
import {environment} from '../../environments/environment';
import {CONTEXT_PATH_URL} from './context-config';

@Injectable({
  providedIn: 'root'
})
export class DocumentApiService {

  private readonly API_BASE_URL = `${CONTEXT_PATH_URL}${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  private readonly MOCK_DOCUMENTS_RESPONSE: DocumentsPageResponse = {
    page: {
      documents: [
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a01ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a02ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a03ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a04ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a05ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a06ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a07ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a08ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a09ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a10ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a83ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: '123321',
          organization: '080Ъ0692',
          navigationNodeId: 'test',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидорова Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a84ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На согласовании!!!',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All1',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидорова Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a85ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На согласовании',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a86ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a87ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a88ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a89ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a90ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a91ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        },
        {
          messageDate: '2025-06-25T07:25:43.511Z',
          subsystem: 'EXP05',
          docGUID: 'a92ec470-d910-4b8d-b7c1-830976c69eac',
          subsystemName: 'ПУР05',
          docTypeId: 'MSC_ApplCashFlow',
          docTypeName: 'ЗКР',
          docState: 'На удал',
          organization: '080Ъ0692',
          navigationNodeId: 'MSC_ApplCashFlow_All',
          users: [
            {id: '45a6d5fd-d1bb-444b-b264-a3cfc201b665', name: 'Иванов П.Д.'},
            {id: 'fad4b295-21a6-4bee-98ea-0077351efd83', name: 'Кузнецов С.К.'},
            {id: '50eb9491-876b-480e-b71f-f835e37f9bd1', name: 'Сидоров Т.П.'}
          ],
          document: {
            docDate: '2024-12-31T21:00:00.000Z',
            docNum: '001',
            tofk: '2200',
            account: '03031218980',
            tofkReceptionTime: '2025-01-02T08:23:45.678Z'
          }
        }
      ],
      pagination: {
        page: 0,
        size: 20,
        totalElements: 27,
        totalPages: 2,
        hasNext: true,
        hasPrevious: false
      }
    },
    filters: {
      filterOptions: [
        {
          subsystem: 'EXP05',
          subsystemName: 'ПУР05',
          docTypes: [
            {
              docTypeId: 'MSC_ApplCashFlow',
              docTypeName: 'ЗКР',
              docStates: ['123321', 'На согласовании!!!']
            }
          ]
        }
      ],
      sortable: [
        'doc_guid',
        'doc_num',
        'doc_date',
        'organization',
        'tofk',
        'tofk_reception_time',
        'account'
      ]
    },
    sortable: [],
    appliedSort: []
  };

  /**
   * Получает список документов с пагинацией
   * @param params - параметры запроса (страница, размер, фильтры, сортировка)
   * @param scope - область поиска (USER или ORG)
   * @returns Observable с ответом API
   *
   * Пример использования:
   * ```typescript
   * const params: DocumentParams = {
   *   page: 0,
   *   size: 20,
   *   filters: [
   *     {
   *       subsystem: 'SUBSYSTEM1',
   *       docTypes: [
   *         { docTypeId: 'TYPE1', docState: ['ACTIVE', 'DRAFT'] }
   *       ]
   *     }
   *   ],
   *   sort: [
   *     { field: 'createdDate', direction: SortDirection.DESC }
   *   ]
   * };
   * this.getDocuments(params, Scope.USER).subscribe(response => {
   *   console.log('Документы:', response.page.documents);
   *   console.log('Фильтры:', response.filters);
   * });
   * ```
   */
  getDocuments(params: DocumentParams, scope: Scope = Scope.USER): Observable<DocumentsPageResponse> {
    return of(this.MOCK_DOCUMENTS_RESPONSE);
  }
}
