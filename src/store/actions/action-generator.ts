import { AxiosResponse } from 'axios';

export interface ActionData {
  onSuccess?: Function;
  onFailure?: Function;
  onFinish?: Function;
}
export type ActionDataContent = ActionData & Record<string, any>;

export interface Options {
  onSuccess?: (params: ActionDataContent, response: any) => object;
  onFailure?: (params: ActionDataContent, error: RequestError) => object;
  onRequest?: (params: ActionDataContent, response: any) => object;
  withRequest?: boolean;
}
export type ActionOptions = Options & Record<string, any>;

export type RequestTypes = {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
};

export interface ActionObject {
  type: string;
  params?: object;
}

export interface RequestActions {
  request: (params: ActionDataContent) => ActionObject;
  success: (params: ActionDataContent, response: AxiosResponse) => ActionObject;
  failure: (params: ActionDataContent, error: RequestError) => ActionObject;
}

export interface RequestError {
  error: any;
  isError: boolean;
}

export interface ActionInterface {
  actionName: string;
  requestTypes: RequestTypes | {};
  actions: RequestActions | {};
  request: (data?: ActionDataContent) => ActionObject;
  cancelActionName: string;
  cancel: () => ActionObject;
}

export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export const createRequestTypes = (base: string): RequestTypes => {
  const acc: { [key: string]: string } = {};
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type: string) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, acc) as RequestTypes;
};

export const action = (type: string, payload = {}) => ({ type, ...payload });

export const makeAction = (name: string): ActionInterface => {
  const generator = new ActionGenerator(name, {});
  return generator.generate();
};

export const makeRequestAction = (name: string, options: ActionOptions): ActionInterface => {
  const generator = new ActionGenerator(name, { ...options, withRequest: true });
  return generator.generate();
};

export const requestActionFactory = (actionName: string): ActionInterface => {
  return makeRequestAction(actionName, {
    onSuccess(params, response) {
      params.onSuccess?.(response);
      params.onFinish?.();
      return {
        ...response,
        params,
      };
    },
    onFailure(params, error) {
      params.onFailure?.(error);
      params.onFinish?.();
      // errorToast('Request Failed!', error.error?.data?.message || '');
      return error;
    },
  });
};

class ActionGenerator {
  private readonly name: string;
  private options: ActionOptions;
  private readonly requestTypes: RequestTypes;

  constructor(name: string, options: ActionOptions) {
    if (!name) {
      throw new Error('Action name must be specified!');
    }
    this.name = name;
    this.options = options;
    this.requestTypes = createRequestTypes(this.name);
  }

  private get loadActionName() {
    return this.options.withRequest ? `LOAD_${this.name}` : this.name;
  }

  private get cancelActionName() {
    return `${this.loadActionName}_CANCEL`;
  }

  private static onFailure(params: ActionDataContent, error: RequestError) {
    return {
      error,
    };
  }
  private static onSuccess() {
    return {};
  }
  private static onRequest() {
    return {};
  }

  private handleSuccess = (params: ActionDataContent, response: AxiosResponse) => {
    const callback = this.options.onSuccess || ActionGenerator.onSuccess;
    return action(this.requestTypes[SUCCESS], callback(params, response));
  };

  private handleRequest = (params: ActionDataContent, response: AxiosResponse) => {
    const callback = this.options.onRequest || ActionGenerator.onRequest;
    return action(this.requestTypes[REQUEST], callback(params, response));
  };

  private handleFailure = (params: ActionDataContent, error: RequestError) => {
    const callback = this.options.onFailure || ActionGenerator.onFailure;
    return action(this.requestTypes[FAILURE], callback(params, error));
  };

  private create = () => ({
    request: this.handleRequest,
    success: this.handleSuccess,
    failure: this.handleFailure,
  });

  public generate = (): ActionInterface => ({
    actionName: this.loadActionName,
    requestTypes: this.options.withRequest ? this.requestTypes : {},
    actions: this.options.withRequest ? this.create() : {},
    request: (data?: ActionDataContent) => action(this.loadActionName, { params: data }),
    cancelActionName: this.cancelActionName,
    cancel: () => action(this.cancelActionName),
  });
}
