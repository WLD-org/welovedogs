type MockResponse<T = unknown> = {
  data: T;
  error: null;
  count: null;
  status: number;
  statusText: string;
};

function createMockQueryBuilder<T = unknown[]>(data: T = [] as T) {
  const response: MockResponse<T> = {
    data,
    error: null,
    count: null,
    status: 200,
    statusText: "OK",
  };

  const builder: Record<string, unknown> = {};
  const chainMethods = [
    "select",
    "insert",
    "update",
    "upsert",
    "delete",
    "eq",
    "neq",
    "in",
    "order",
    "limit",
    "range",
    "filter",
    "match",
    "or",
    "not",
    "is",
    "contains",
    "containedBy",
  ];

  for (const method of chainMethods) {
    builder[method] = () => builder;
  }

  builder.single = async () => ({ data: null, error: null });
  builder.maybeSingle = async () => ({ data: null, error: null });

  const promise = Promise.resolve(response);
  builder.then = promise.then.bind(promise);
  builder.catch = promise.catch.bind(promise);
  builder.finally = promise.finally.bind(promise);

  return builder;
}

export function createMockSupabaseClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithOtp: async () => ({ data: {}, error: null }),
      signInWithOAuth: async () => ({ data: { provider: null, url: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => createMockQueryBuilder(),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        download: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
    }),
    removeChannel: () => {},
  };
}
