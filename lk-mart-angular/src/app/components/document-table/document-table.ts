import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NzTableModule} from 'ng-zorro-antd/table';
import {NzButtonModule} from 'ng-zorro-antd/button';

import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzDescriptionsModule} from 'ng-zorro-antd/descriptions';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {FormsModule} from '@angular/forms';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {catchError, of, Subscription} from 'rxjs';
import {
  AppliedFilters,
  ColumnFilter,
  DocTypeOption,
  Document,
  DocumentParams,
  DocumentTypeFilter,
  FilterOption,
  Scope,
  SortCriterion,
  SortDirection,
  StatusOption,
  SubsystemFilter,
  SubsystemOption
} from '../../models/types';
import {NzTreeNodeOptions} from 'ng-zorro-antd/core/tree';
import {DocumentApiService} from '../../services/document-api';
import {DocumentOpenService} from '../../services/document-open';
import {NavigationNodesService} from '../../services/navigation-nodes';
import {ModalService} from '../../services/modal';
import {NzTooltipDirective} from 'ng-zorro-antd/tooltip';
import {NzCalendarComponent} from 'ng-zorro-antd/calendar';
import {NzTreeSelectComponent} from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'app-document-table',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzCardModule,
    NzTagModule,
    NzIconModule,
    NzSpinModule,
    NzAlertModule,
    NzSpaceModule,
    NzDividerModule,
    NzTypographyModule,
    NzBadgeModule,
    NzAvatarModule,
    NzDescriptionsModule,
    NzModalModule,
    FormsModule,
    NzDropDownModule,
    NzSelectModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzTooltipDirective,
    NzCalendarComponent,
    NzTreeSelectComponent
  ],
  templateUrl: './document-table.html',
  styleUrl: './document-table.css'
})
export class DocumentTableComponent implements OnInit, OnDestroy {

  documents: Document[] = [];
  loading = false;
  subsystemLoading = false; // Состояние загрузки для клика по подсистеме
  private subsystemSubscription: Subscription | null = null; // Подписка для возможности отмены
  error: string | null = null;
  currentScope: Scope = Scope.USER;

  pageIndex = 1;
  pageSize = 20;
  total = 0;

  // Доступные фильтры
  // Выбор даты
  currentDocDate: Date | null = null;
  currentTofkReceptionTime: Date | null = null;
  tempDocDate: Date | null = null;
  tempTofkReceptionTime: Date | null = null;

  // Поиск по номеру документа
  docNumFilterValue: string | null = null;
  tempDocNumFilterValue: string | null = null;

  // Поиск по лицевому счёту
  accountFilterValue: string | null = null;
  tempAccountFilterValue: string | null = null;

  // Поиск по коду ТОФК
  tofkFilterValue: string | null = null;
  tempTofkFilterValue: string | null = null;

  availableFilters: FilterOption[] = [];
  subsystemOptions: SubsystemOption[] = [];
  allDocTypeOptions: DocTypeOption[] = [];
  allStatusOptions: StatusOption[] = [];
  // доступные опции для селектов
  docTypeFilterOptions: DocTypeOption[] = [];
  statusTreeNodes: NzTreeNodeOptions[] = [];

  // Каскадные фильтры
  dateFilterVisible = false;
  dateTofkReceptionTimeVisible = false;
  docNumFilterVisible = false;
  accountFilterVisible = false;
  tofkFilterVisible = false;

  // Связанные фильтры
  subsystemFilterVisible = false;
  docTypeFilterVisible = false;
  statusFilterVisible = false;

  // Свойства для связанных фильтров
  subsystemFilterValue: string | null = null;
  tempSubsystemFilter: string | null = null;
  docTypeFilterValue: string[] = [];
  tempDocTypeFilter: string[] = [];
  statusFilterValue: string[] = [];
  tempStatusFilter: string[] = [];

  // Примененные фильтры (для сравнения)
  appliedFilters: AppliedFilters = {
    docNum: null,
    account: null,
    tofk: null,
    subsystem: null,
    docType: [],
    status: [],
    date: null,
    tofkReceptionTime: null
  };
  appliedSort: SortCriterion[] = [];
  // Сортировка
  sortableColumns: string[] = [];
  // Текущая сортировка
  currentSort: SortCriterion[] = [];

  // Состояние сортировки для каждой колонки
  sortState: { [key: string]: SortDirection } = {};

  constructor(
    private documentApiService: DocumentApiService,
    private documentOpenService: DocumentOpenService,
    private navigationNodesService: NavigationNodesService,
    private modalService: ModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    // Загружаем документы при инициализации
    this.loadDocuments();

    // Инициализируем примененные фильтры
    this.saveAppliedFilters();
  }

  ngOnDestroy(): void {
    // Очищаем подписку при уничтожении компонента
    if (this.subsystemSubscription) {
      this.subsystemSubscription.unsubscribe();
      this.subsystemSubscription = null;
    }
  }

  /**
   * Переключает режим отображения документов
   */
  switchScope(scope: string): void {
    const newScope = scope as Scope;
    if (this.currentScope !== newScope) {
      this.currentScope = newScope;
      // Очищаем сортировку при смене области и перезагружаем
      this.reloadAll()
    }
  }

  /**
   * Проверяет, активен ли указанный режим
   */
  isScopeActive(scope: string): boolean {
    return this.currentScope === scope as Scope;
  }

  /**
   * Загружает документы
   */
  loadDocuments(): void {
    this.loading = true;
    const page = this.pageIndex - 1;

    const params: DocumentParams = {
      page: page,
      size: this.pageSize,
      filters: {
        subsystemFilters: [],
        columnFilters: [],
        filterDate: null,
        tofkReceptionTimeFilter: null
      },
      sort: this.currentSort
    };

    this.addDateFilterToParams(params);
    this.applyColumnFilters(params);

    // Применяем связанные фильтры
    this.addSubsystemFilterToParams(params);

    const request =
      this.documentApiService.getDocuments( params, this.currentScope)

    request.subscribe({
      next: (response) => {
        // Обновляем данные
        this.documents = response.page.documents;
        this.total = response.page.pagination.totalElements;

        if (response.filters) {
          this.updateFiltersFromResponse(response.filters);
        }
      },
      error: (error) => {
        console.error('Ошибка загрузки документов:', error);
        this.notification.error('Ошибка', 'Не удалось загрузить документы', {
          nzPlacement: 'bottomRight'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /**
   * Обработчик изменения страницы
   */
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadDocuments();
  }

  /**
   * Обработчик изменения размера страницы
   */
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1; // Сбрасываем на первую страницу
    this.loadDocuments();
  }

  /**
   * Обработчик изменения сортировки
   * Ограничение: искусственно запрещаю сортировки по нескольким столбцам сразу
   * из-за косяка с отображением фильтров
   */
  onSortChange(sort: any): void {
    const columnName = sort.key;

    // Проверяем, поддерживается ли сортировка для данной колонки
    if (columnName && !this.isColumnSortable(columnName)) {
      return;
    }

    let direction = this.resolveDirection(sort);

    // Если направление сортировки не null
    if (direction) {
      // Обновляем состояние сортировки
      this.sortState[columnName] = direction;
      const sortCriterion: SortCriterion = {
        field: columnName,
        direction: direction
      }
      // 1 Фильтр сортировки на запрос
      let findIndex = this.currentSort
        .findIndex(e => e.field === columnName);

      if (findIndex > -1 ) {
        this.currentSort[findIndex] = sortCriterion;
      } else {
        this.currentSort.push(sortCriterion);
      }
    } else {
      delete this.sortState[columnName];
      const existingSortIndex = this.currentSort.findIndex(
        (sort: SortCriterion) => sort.field === columnName
      );

      if (existingSortIndex !== -1) {
        // удаляем из фильтров для сортировки
        this.currentSort.splice(existingSortIndex, 1);
      }
    }
  }

  /**
   * Отменяет текущую операцию загрузки навигационных узлов
   */
  cancelSubsystemOperation(): void {
    if (this.subsystemSubscription) {
      this.subsystemSubscription.unsubscribe();
      this.subsystemSubscription = null;
    }
    this.subsystemLoading = false;
    this.notification.info('Открытие списковой формы',
      'Операция отменена',
      {nzPlacement: 'bottomRight'}
    );
  }

  /**
   * Обработчик клика по подсистеме
   */
  onSubsystemClick(document: Document): void {
    const subsystem = document.subsystem;
    const docType = document.docTypeId;
    const navigationNodeId = document.docTypeId;

    // Показываем спиннер
    this.subsystemLoading = true;

    this.subsystemSubscription = this.navigationNodesService.getNavigationNodes(subsystem, docType)
      .pipe(
        catchError(error => {
          this.subsystemLoading = false;
          this.subsystemSubscription = null;

          if (error.message && error.message.includes('Таймаут')) {
            this.notification.error('Открытие списковой формы', 'Превышено время ожидания ответа от сервера', {
              nzPlacement: 'bottomRight'
            });
          } else {
            console.error('Ошибка получения навигационных узлов:', error);
            this.notification.error('Ошибка', 'Не удалось открыть списковую форму', {
              nzPlacement: 'bottomRight'
            });
          }
          return of(null);
        })
      )
      .subscribe({
        next: (nodes) => {
          this.subsystemLoading = false; // Скрываем спиннер
          this.subsystemSubscription = null;
          if (nodes && nodes.length > 0) {
            let availableNodes = [];
            if (navigationNodeId) {
              availableNodes = [...nodes
                .filter(item => item.id === navigationNodeId)];
            } else {
              availableNodes = [...nodes];
            }
            this.modalService.showNavigationNodesModal({
              nodes: availableNodes,
              subsystem: subsystem,
              docType: docType
            });
          } else if (nodes) {
            this.notification.warning('Нет данных', 'Нет доступных подсистем', {
              nzPlacement: 'bottomRight'
            });
          }
        }
      });
  }

  /**
   * Форматирует дату
   */
  formatDate(isoString: string,
             format: {} = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
  ): string {
    if (isoString) {
      let date = new Date(isoString);
      return date.toLocaleString('ru-RU', format)
    } else {
      return '';
    }
  }

  /**
   * Проверяет, является ли колонка сортируемой
   */
  isColumnSortable(columnName: string): boolean {
    return this.sortableColumns.includes(columnName);
  }

  /**
   * Обработчик изменения текущих данных страницы
   */
  onCurrentPageDataChange(data: readonly Document[]): void {
    // пока нет логики
  }

  onDocNumClick(document: Document, event: Event): void {
    event.stopPropagation();
    this.documentOpenService.openDocument(document);
  }

  reloadAll(): void {
    this.resetAllFilters();
    this.loadDocuments();
  }

  isDocNumFilterActive(): boolean {
    return this.isTextFilterActive(this.docNumFilterValue);
  }

  isMessageDateFilterActive(): boolean {
    return this.currentDocDate !== null;
  }

  isTofkReceptionTimeFilterActive(): boolean {
    return this.currentTofkReceptionTime !== null;
  }

  getCurrentDocDate(): string {
    if (!this.currentDocDate) {
      return "";
    }

    return this.getDateString(this.currentDocDate);
  }

  getTofkCurrentReceptionTime(): string {
    if (!this.currentTofkReceptionTime) {
      return "";
    }

    return this.getDateString(this.currentTofkReceptionTime);
  }

  getCurrentDocNum(): string {
    return this.getCurrentFilterValue(this.docNumFilterValue);
  }

  onDateValueChange(value: Date): void {
    this.tempDocDate = value;
  }

  onTofkDateValueChange(value: Date): void {
    this.tempTofkReceptionTime = value;
  }

  resetDateFilter(): void {
    this.currentDocDate = null;
    this.tempDocDate = null;
    this.dateFilterVisible = false;
  }

  resetTofkDateFilter(): void {
    this.currentTofkReceptionTime = null;
    this.tempTofkReceptionTime = null;
    this.tofkFilterVisible = false;
  }

  applyDateFilter(): void {
    this.currentDocDate = this.tempDocDate;
    this.dateFilterVisible = false;
  }

  applyTofkDateFilter(): void {
    this.currentTofkReceptionTime = this.tempTofkReceptionTime;
    this.dateTofkReceptionTimeVisible = false;
  }

  /**
   * Применяет фильтр по номеру документа
   */
  applyDocNumFilter(): void {
    this.docNumFilterValue = this.tempDocNumFilterValue;
    this.docNumFilterVisible = false;
  }

  onDateFilterOpen(): void {
    this.tempDocDate = this.currentDocDate;
  }

  onTofkDateFilterOpen(): void {
    this.tempTofkReceptionTime = this.currentTofkReceptionTime;
  }

  onDocNumFilterOpen(): void {
    this.tempDocNumFilterValue = this.docNumFilterValue || '';
  }

  resetDocNumFilter(): void {
    this.docNumFilterValue = null;
    this.tempDocNumFilterValue = null;
    this.docNumFilterVisible = false;
  }

  // Методы для фильтра по лицевому счёту
  isAccountFilterActive(): boolean {
    return this.isTextFilterActive(this.accountFilterValue);
  }

  getCurrentAccount(): string {
    return this.getCurrentFilterValue(this.accountFilterValue);
  }

  onAccountFilterOpen(): void {
    this.tempAccountFilterValue = this.accountFilterValue || '';
  }

  applyAccountFilter(): void {
    this.accountFilterValue = this.tempAccountFilterValue;
    this.accountFilterVisible = false;
  }

  resetAccountFilter(): void {
    this.accountFilterValue = null;
    this.tempAccountFilterValue = null;
    this.accountFilterVisible = false;
  }

  isTofkFilterActive(): boolean {
    return this.isTextFilterActive(this.tofkFilterValue);
  }

  getCurrentTofk(): string {
    return this.getCurrentFilterValue(this.tofkFilterValue);
  }

  onTofkFilterOpen(): void {
    this.tempTofkFilterValue = this.tofkFilterValue || '';
  }

  applyTofkFilter(): void {
    this.tofkFilterValue = this.tempTofkFilterValue;
    this.tofkFilterVisible = false;
  }

  resetTofkFilter(): void {
    this.tofkFilterValue = null;
    this.tempTofkFilterValue = null;
    this.tofkFilterVisible = false;
  }

  isSubsystemFilterActive(): boolean {
    return this.subsystemFilterValue !== null
      && this.subsystemFilterValue.trim() !== '';
  }

  getCurrentSubsystem(): string {
    const code = this.subsystemFilterValue;
    return code
      ? (this.subsystemOptions
          .find(o => o.value === code)?.label || code)
      : '';
  }

  onSubsystemFilterOpen(): void {
    this.tempSubsystemFilter = this.subsystemFilterValue || '';
  }

  onTempSubsystemFilterChange(value: string | null): void {
    this.tempSubsystemFilter = value;
    this.tempDocTypeFilter = [];
    this.tempStatusFilter = [];
    this.updateDocTypeFilterOptions(value);
    this.updateStatusFilterOptions([]);
  }

  applySubsystemFilter(): void {
    this.subsystemFilterValue = this.tempSubsystemFilter;
    // при смене подсистемы очищаем связанные значения
    this.docTypeFilterValue = [];
    this.statusFilterValue = [];
    this.updateDocTypeFilterOptions(this.subsystemFilterValue);
    this.updateStatusFilterOptions([]);
    this.subsystemFilterVisible = false;
    this.docTypeFilterVisible = false;
  }

  resetSubsystemFilter(): void {
    this.subsystemFilterValue = null;
    this.tempSubsystemFilter = null;
    this.docTypeFilterValue = [];
    this.tempDocTypeFilter = [];
    this.statusFilterValue = [];
    this.tempStatusFilter = [];
    this.docTypeFilterOptions = [];
    this.statusTreeNodes = [];
    this.subsystemFilterVisible = false;
    this.docTypeFilterVisible = false;
  }

  isDocTypeFilterActive(): boolean {
    return this.isDocTypeFilterAvailable() && this.docTypeFilterValue.length > 0;
  }

  /**
   * Проверяет, доступен ли фильтр типов документов (есть ли выбранная подсистема)
   */
  isDocTypeFilterAvailable(): boolean {
    return this.isSubsystemFilterActive() && this.docTypeFilterOptions.length > 0;
  }
  /**
   * Проверяет, доступен ли фильтр статусов документов (есть ли выбранная подсистема и тип документа)
   */
  isDocStateFilterAvailable(): boolean {
    return this.isDocTypeFilterActive() && this.statusTreeNodes.length > 0;
  }

  getCurrentDocType(): string {
    if (!this.isDocTypeFilterAvailable()) {
      return '';
    }
    return this.docTypeFilterValue.length > 0
      ? this.docTypeFilterValue
        .map(id => this.allDocTypeOptions.find(o => o.value === id)?.label || id)
        .join(', ')
      : '';
  }

  onDocTypeFilterOpen(): void {
    if (!this.isDocTypeFilterAvailable()) {
      return;
    }
    this.tempDocTypeFilter = [...this.docTypeFilterValue];
  }

  onTempDocTypeFilterChange(values: string[]): void {
    if (!this.isDocTypeFilterAvailable()) {
      return;
    }
    this.tempDocTypeFilter = values;
    this.updateStatusFilterOptions(values);

    if (this.tempStatusFilter.length > 0) {
      const validStatuses = this.tempStatusFilter.filter(key => {
        if (!key.includes('+')) return false;
        const docTypeId = key.split('+')[0];
        return values.includes(docTypeId);
      });

      if (validStatuses.length !== this.tempStatusFilter.length) {
        this.tempStatusFilter = validStatuses;
      }
    }
  }

  applyDocTypeFilter(): void {
    if (!this.isDocTypeFilterAvailable()) {
      return;
    }
    this.docTypeFilterValue = [...this.tempDocTypeFilter];
    this.updateStatusFilterOptions(this.docTypeFilterValue);
    this.docTypeFilterVisible = false;
  }

  resetDocTypeFilter(): void {
    this.docTypeFilterValue = [];
    this.tempDocTypeFilter = [];
    this.docTypeFilterVisible = false;
    this.statusFilterValue = [];
    this.tempStatusFilter = [];
    this.updateStatusFilterOptions([]);
  }

  isStatusFilterActive(): boolean {
    return this.statusFilterValue.length > 0;
  }

  getCurrentStatus(): string {
    if (this.statusFilterValue.length === 0) {
      return '';
    }

    // Группируем статусы по типам документов для более читаемого отображения
    const statusGroups = new Map<string, string[]>();

    this.statusFilterValue.forEach(selectedKey => {
      if (selectedKey.includes('+')) {
        const parts = selectedKey.split('+');
        const docTypeId = parts[0];
        const statusValue = parts[1];

        const docTypeOption = this.allDocTypeOptions
          .find(dt => dt.value === docTypeId);
        const statusOption = this.allStatusOptions
          .find(st => st.value === statusValue);

        if (docTypeOption && statusOption) {
          const docTypeName = docTypeOption.label;
          if (!statusGroups.has(docTypeName)) {
            statusGroups.set(docTypeName, []);
          }
          statusGroups.get(docTypeName)!.push(statusOption.label);
        }
      }
    });

    // Формируем строку в формате "Тип1: Статус1, Статус2; Тип2: Статус3"
    return Array.from(statusGroups.entries())
      .map(([docType, statuses]) => `${docType}: ${statuses.join(', ')}`)
      .join('; ');
  }

  onStatusFilterOpen(): void {
    this.tempStatusFilter = [...this.statusFilterValue];
    this.updateStatusFilterOptions(this.docTypeFilterValue);
  }

  onTempStatusFilterChange(values: string[]): void {
    const selectedStatusKeys = values.filter(this.isStatusKey);
    const selectedDocTypeIds = values.filter(this.isDocTypeKey);

    const expandedStatusKeys = this.expandDocTypesToStatuses(selectedDocTypeIds);

    this.tempStatusFilter = [...selectedStatusKeys, ...expandedStatusKeys];
  }

  applyStatusFilter(): void {
    // Валидируем выбранные статусы
    const validStatuses = this.tempStatusFilter.filter(key => {
      if (!key.includes('+')) {
        return false; // Пропускаем родительские узлы
      }

      const parts = key.split('+');
      if (parts.length !== 2) {
        return false;
      }

      const docTypeId = parts[0];
      const statusValue = parts[1];

      // Проверяем, что тип документа и статус существуют
      const docTypeExists = this.allDocTypeOptions
        .some(dt => dt.value === docTypeId);
      const statusExists = this.allStatusOptions
        .some(st => st.value === statusValue);

      return docTypeExists && statusExists;
    });

    this.statusFilterValue = validStatuses;
    this.statusFilterVisible = false;

    if (validStatuses.length !== this.tempStatusFilter.length) {
      console.log('Некоторые выбранные статусы были исключены из-за несоответствия данных');
    }
  }

  resetStatusFilter(): void {
    this.statusFilterValue = [];
    this.tempStatusFilter = [];
    this.statusFilterVisible = false;
  }
  /**
   * Получает текст для tooltip фильтра статусов
   */
  getStatusFilterTooltip(): string {
    if (!this.isStatusFilterActive()) {
      return 'Фильтр по статусу';
    }

    return  this.getCurrentStatus();
  }

  /**
   * Проверяет, есть ли активные фильтры для применения
   */
  hasActiveFilters(): boolean {
    return this.hasFilterChanges();
  }

  /**
   * Проверяет, есть ли примененные фильтры
   */
  hasAnyAppliedFilters(): boolean {
    return this.appliedFilters.docNum !== null ||
      this.appliedFilters.account !== null ||
      this.appliedFilters.tofk !== null ||
      this.appliedFilters.subsystem !== null ||
      this.appliedFilters.docType.length > 0 ||
      this.appliedFilters.status.length > 0 ||
      this.currentSort.length > 0 || // сортировка
      this.appliedFilters.date !== null ||
      this.appliedFilters.tofkReceptionTime !== null;
  }

  /**
   * Применяет все активные фильтры и загружает документы
   */
  applyAllFilters(): void {
    const hasChanges = this.hasActiveFilters();

    if (hasChanges) {
      // Если есть изменения в фильтрах, сбрасываем на первую страницу
      this.pageIndex = 1;
      // Сохраняем текущие фильтры как примененные
      this.saveAppliedFilters();
      this.notifyIfHighLoadExpected()
    }
    // Если нет изменений, сохраняем текущую пагинацию

    this.loadDocuments();
  }

  // Ограничение на выбор даты (3 дня до текущей даты и после 2 дней)
  disableOutside3Days(current: Date): boolean {
    const today = new Date();
    const minDate = new Date(today);
    const maxDate = new Date(today);

    minDate.setDate(today.getDate() - 3);
    maxDate.setDate(today.getDate() + 2);

    return current < minDate || current > maxDate;
  }

  /**
   * Обработчик клика по ссылке на документ(ToDo:Доделать!!!)
   * @param document - документ
   * @param event - событие
   */
  onDocLinkClick(document: Document): void {
    console.log('onDocLinkClick', document);
    this.documentOpenService.openDocument(document);
  }

  /**
   * Получает текущее направление сортировки для колонки
   */
  getSortDirection(columnName: string): string | null {
    const dir = this.sortState[columnName];
    if (dir) {
      return dir === SortDirection.ASC
        ? 'ascend'
        : 'descend'
    } else {
      return null;
    }
  }

  private isTextFilterActive(filterValue: string | null): boolean {
    return filterValue !== null && filterValue.trim() !== '';
  }

  private getCurrentFilterValue(filterValue: string | null): string {
    return filterValue || '';
  }

  /**
   * Применяет фильтр по дате к параметрам запроса
   */
  private addDateFilterToParams(params: DocumentParams): void {
    if (this.isMessageDateFilterActive()) {
      params.filters.filterDate = this.currentDocDate;
    }

    if (this.isTofkReceptionTimeFilterActive()) {
      params.filters.tofkReceptionTimeFilter = this.currentTofkReceptionTime;
    }
  }

  /**
   * Применяет все активные колоночные фильтры к параметрам запроса
   */
  private applyColumnFilters(params: DocumentParams): void {
    this.addDocNumFilterToParams(params);
    this.addAccountFilterToParams(params);
    this.addTofkFilterToParams(params);
  }

  /**
   * Применяет фильтр по номеру документа к параметрам запроса
   */
  private addDocNumFilterToParams(params: DocumentParams): void {
    if (this.isDocNumFilterActive()) {
      const docNumFilter: ColumnFilter = {
        column: 'doc_num',
        searchValue: this.getCurrentFilterValue(this.docNumFilterValue)
      };
      params.filters.columnFilters?.push(docNumFilter);
    }
  }

  /**
   * Применяет фильтр по лицевому счёту к параметрам запроса
   */
  private addAccountFilterToParams(params: DocumentParams): void {
    if (this.isAccountFilterActive()) {
      const accountFilter: ColumnFilter = {
        column: 'account',
        searchValue: this.getCurrentFilterValue(this.accountFilterValue)
      };
      params.filters.columnFilters?.push(accountFilter);
    }
  }

  /**
   * Применяет фильтр по коду ТОФК к параметрам запроса
   */
  private addTofkFilterToParams(params: DocumentParams): void {
    if (this.isTofkFilterActive()) {
      const tofkFilter: ColumnFilter = {
        column: 'tofk',
        searchValue: this.getCurrentFilterValue(this.tofkFilterValue)
      };
      params.filters.columnFilters?.push(tofkFilter);
    }
  }

  /**
   * Обновляет опции фильтра типов документов на основе выбранной подсистемы
   */
  private updateDocTypeFilterOptions(subsystem: string | null): void {
    if (!subsystem) {
      this.docTypeFilterOptions = [];
      return;
    }

    this.docTypeFilterOptions = this.allDocTypeOptions
      .filter(dt => dt.subsystem.value === subsystem);
  }

  /**
   * Обновляет опции фильтра статусов на основе выбранных типов документов
   */
  private updateStatusFilterOptions(docTypeIds: string[]): void {
    const subsystem = this.tempSubsystemFilter || this.subsystemFilterValue;
    if (!subsystem || docTypeIds.length === 0) {
      this.statusTreeNodes = [];
      return;
    }

    this.statusTreeNodes = docTypeIds.map(docTypeId => {
      const docTypeOption = this.allDocTypeOptions.find(
        dt => dt.value === docTypeId && dt.subsystem.value === subsystem
      );
      const children = this.allStatusOptions
        .filter(st => st.subsystem.value === subsystem
          && st.docType.value === docTypeId)
        .map(st => ({
          title: st.label,
          key: docTypeId + '+' + st.value,
          isLeaf: true
        }));
      return {
        title: docTypeOption?.label || docTypeId,
        key: docTypeId,
        selectable: false,
        children
      } as NzTreeNodeOptions;
    });
  }

  /**
   * Применяет связанные фильтры (подсистема, тип документа, статус) к параметрам запроса
   */
  private addSubsystemFilterToParams(params: DocumentParams): void {
    if (this.isSubsystemFilterActive()) {
      const subsystemFilter: SubsystemFilter = {
        subsystem: this.subsystemFilterValue!,
        documentTypes: []
      };

      // Добавляем типы документов если они выбраны
      this.addDocTypesId(subsystemFilter);

      if (!params.filters.subsystemFilters) {
        params.filters.subsystemFilters = [];
      }

      params.filters.subsystemFilters.push(subsystemFilter);
    }
  }

  private addDocTypesId(subsystemFilter: SubsystemFilter) {
    if (this.isDocTypeFilterActive()) {
      subsystemFilter.documentTypes = this.docTypeFilterValue
        .map(docTypeId => {
          const docTypeFilter: DocumentTypeFilter = {
            documentTypeId: docTypeId,
            documentStates: []
          };

          // Добавляем статусы если они выбраны
          this.addDocStatus(docTypeFilter);

          return docTypeFilter;
        });
    }
  }

  private addDocStatus(docTypeFilter: DocumentTypeFilter) {
    if (this.isStatusFilterActive()) {
      // Извлекаем статусы для конкретного типа документа
      const statusesForDocType = this.statusFilterValue
        .filter(key => key.startsWith(docTypeFilter.documentTypeId + '+'))
        .map(key => key.split('+')[1]);

      docTypeFilter.documentStates = statusesForDocType;
    }
  }

  /**
   * Сохраняет текущие фильтры как примененные
   */
  private saveAppliedFilters(): void {
    this.appliedFilters = {
      docNum: this.docNumFilterValue,
      account: this.accountFilterValue,
      tofk: this.tofkFilterValue,
      subsystem: this.subsystemFilterValue,
      docType: [...this.docTypeFilterValue],
      status: [...this.statusFilterValue],
      date: this.currentDocDate
        ? new Date(this.currentDocDate)
        : null,
      tofkReceptionTime: this.currentTofkReceptionTime
        ? new Date(this.currentTofkReceptionTime)
        : null
    };
    this.appliedSort = [...this.currentSort];
  }

  /**
   * Сравниваем два массива
   */
  private arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    return arr1.every((value, index) => value === arr2[index]);
  }

  private arraysSortCriterionEqual(a: SortCriterion[], b: SortCriterion[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((v, i) =>
      v.field === b[i]?.field && v.direction === b[i]?.direction
    );
  }
  /**
   * Сравниваем две даты
   */
  private datesEqual(date1: Date | null, date2: Date | null): boolean {
    if (date1 === null && date2 === null) {
      return true;
    }
    if (date1 === null || date2 === null) {
      return false;
    }
    return date1.getTime() === date2.getTime();
  }

  /**
   * Проверяем, есть ли изменения в фильтрах по сравнению с примененными
   */
  private hasFilterChanges(): boolean {
    // Проверяем фильтр по номеру документа
    if (this.docNumFilterValue !== this.appliedFilters.docNum) {
      return true;
    }

    // Проверяем фильтр по лицевому счёту
    if (this.accountFilterValue !== this.appliedFilters.account) {
      return true;
    }

    // Проверяем фильтр по коду ТОФК
    if (this.tofkFilterValue !== this.appliedFilters.tofk) {
      return true;
    }

    // Проверяем фильтр по подсистеме
    if (this.subsystemFilterValue !== this.appliedFilters.subsystem) {
      return true;
    }

    // Проверяем фильтр по типу документа
    if (!this.arraysEqual(this.docTypeFilterValue, this.appliedFilters.docType)) {
      return true;
    }

    // Проверяем фильтр по статусу
    if (!this.arraysEqual(this.statusFilterValue, this.appliedFilters.status)) {
      return true;
    }

    if (!this.arraysSortCriterionEqual(this.appliedSort, this.currentSort)) {
      return true;
    }

    if (!this.datesEqual(this.currentTofkReceptionTime, this.appliedFilters.tofkReceptionTime)) {
      return true;
    }

    // Проверяем фильтр по дате
    return !this.datesEqual(this.currentDocDate, this.appliedFilters.date);
  }

  private resolveDirection(sort: { key: string; value: 'ascend' | 'descend' | null }) {
    let direction;
    if (sort.value === 'ascend') {
      direction = SortDirection.ASC;
    } else if (sort.value === 'descend') {
      direction = SortDirection.DESC;
    }
    return direction;
  }

  /**
   * Обновляет данные фильтров из ответа API
   */
  private updateFiltersFromResponse(filters: any): void {
    if (filters && filters.filterOptions) {
      this.availableFilters = filters.filterOptions;

      this.subsystemOptions = [];
      this.allDocTypeOptions = [];
      this.allStatusOptions = [];

      this.availableFilters.forEach(f => {
        const subsystem: SubsystemOption = {
          label: f.subsystemName,
          value: f.subsystem
        };
        this.subsystemOptions = [...this.subsystemOptions, subsystem];
        f.docTypes.forEach(dt => {
          const docType: DocTypeOption = {
            label: dt.docTypeName,
            value: dt.docTypeId,
            subsystem
          };
          this.allDocTypeOptions = [...this.allDocTypeOptions, docType];

          dt.docStates.forEach(state => {
            this.allStatusOptions = [...this.allStatusOptions, {
              label: state,
              value: state,
              subsystem,
              docType
            }];
          });
        });
      });

      if (this.subsystemOptions.length === 1) {
        this.updateDocTypeFilterOptions(this.subsystemFilterValue);
      } else {
        this.docTypeFilterOptions = [];
        this.statusTreeNodes = [];
      }
    }

    if (filters && filters.sortable) {
      this.sortableColumns = filters.sortable;
    }
  }

  private resetAllFilters(): void {
    // Сброс фильтров по номеру документа
    this.docNumFilterValue = null;
    this.tempDocNumFilterValue = null;
    this.docNumFilterVisible = false;

    // Сброс фильтров по дате
    this.currentDocDate = null;
    this.tempDocDate = null;
    this.dateFilterVisible = false;

    this.currentTofkReceptionTime = null;
    this.tempTofkReceptionTime = null;
    this.tofkFilterVisible = false;

    // Сброс фильтров по лицевому счёту
    this.accountFilterValue = null;
    this.tempAccountFilterValue = null;
    this.accountFilterVisible = false;

    // Сброс фильтров по коду ТОФК
    this.tofkFilterValue = null;
    this.tempTofkFilterValue = null;
    this.tofkFilterVisible = false;

    // Сброс новых связанных фильтров
    this.subsystemFilterValue = null;
    this.tempSubsystemFilter = null;
    this.subsystemFilterVisible = false;
    this.docTypeFilterValue = [];
    this.tempDocTypeFilter = [];
    this.docTypeFilterVisible = false;
    this.statusFilterValue = [];
    this.tempStatusFilter = [];
    this.statusFilterVisible = false;
    this.subsystemOptions = [];
    this.allDocTypeOptions = [];
    this.allStatusOptions = [];
    this.docTypeFilterOptions = [];
    this.statusTreeNodes = [];

    // Сброс сортировки
    this.currentSort = [];
    this.sortState = {};
    this.appliedSort = [];

    // Сбрасываем на первую страницу, но не загружаем документы автоматически
    this.pageIndex = 1;

    // Сбрасываем примененные фильтры
    this.appliedFilters = {
      docNum: null,
      account: null,
      tofk: null,
      subsystem: null,
      docType: [],
      status: [],
      date: null,
      tofkReceptionTime: null
    };
  }

  private isStatusKey(key: string): boolean {
    return key.includes('+');
  }

  private isDocTypeKey(key: string): boolean {
    return !key.includes('+') && key.length > 0;
  }

  // Если был выбран узел(все статусы), то формируем массив
  private expandDocTypesToStatuses(docTypeIds: string[]): string[] {
    return docTypeIds.flatMap(docTypeId =>
      this.allStatusOptions
        .filter(so => so.docType.value === docTypeId)
        .map(so => `${docTypeId}+${so.value}`)
    );
  }

  private notifyIfHighLoadExpected() {
    const { docNum, tofk, account } = this.appliedFilters;

    const hasAnyFilter = [docNum, tofk, account].some(
      val => val !== null && val.trim() !== ''
    );

    if (hasAnyFilter) {
      this.notification.warning('Уведомление',
        'Фильтрация по номеру документа, ТОФК или счёту может занять больше времени', {
          nzPlacement: 'bottomRight'
        });
    }
  }

  private getDateString(date: Date): string {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
