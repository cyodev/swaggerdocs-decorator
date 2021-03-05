import { SwaggerDocs } from './swagger-docs.decorator';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import * as SwaggerLib from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam
} from '@nestjs/swagger';

export async function setup() {
  process.env.TESTING = 'true';

  const testingModule = await Test.createTestingModule({
    imports: []
  }).compile();

  const app = testingModule.createNestApplication<NestExpressApplication>();
  await app.init();
  return app;
}

class MockUtils {
  static mockMethodDecorator(a, b, c) {
    return c;
  }

  static mockMethodDecorator2(a, b, c) {
    return c;
  }

  static mockMethodDecorator3(a, b, c) {
    return c;
  }

  static mockClassDecorator(a) {
    return a;
  }

  static mockDualDecorator(a, b, c) {
    return c || a;
  }
}

describe('Swagger Docs Decorator', () => {
  // @ts-ignore
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await setup();
  });

  beforeEach(async () => {
    jest.spyOn(Logger, 'error').mockImplementation(() => '');
    jest.spyOn(Logger, 'warn').mockImplementation(() => '');
    jest.spyOn(Logger, 'log').mockImplementation(() => '');
    jest.spyOn(MockUtils, 'mockMethodDecorator');
    jest.spyOn(MockUtils, 'mockClassDecorator');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should handle non-function arguments gracefully and log errors.', () => {
    class TestApiDocs {
      get = [[], 5];
    }

    @SwaggerDocs(TestApiDocs)
    // @ts-ignore
    class TestController {
      async get() {
        return { data: [] };
      }
    }

    expect(Logger.error).toBeCalled();
    expect(Logger.warn).toBeCalledTimes(0);
    expect(Logger.log).toBeCalledTimes(0);
  });

  it('should handle malformed function arguments gracefully and log errors.', () => {
    class TestApiDocs {
      get = [(a, b, c) => 5];
    }

    @SwaggerDocs(TestApiDocs)
    // @ts-ignore
    class TestController {
      async get() {
        return { data: [] };
      }
    }

    expect(Logger.error).toBeCalled();
    expect(Logger.warn).toBeCalledTimes(0);
    expect(Logger.log).toBeCalledTimes(0);
  });

  it(
    'should handle malformed docs container properties gracefully and ' +
      'log errors.',
    () => {
      class TestApiDocs {
        get = 'Not an array';
      }

      @SwaggerDocs(TestApiDocs)
      // @ts-ignore
      class TestController {
        async get() {
          return { data: [] };
        }
      }

      expect(Logger.error).toBeCalled();
      expect(Logger.warn).toBeCalledTimes(0);
      expect(Logger.log).toBeCalledTimes(0);
    }
  );

  it('should issue a warning if an extra documentation parameter is found.', () => {
    class TestApiDocs {
      get = [];
      routeDoesntExist = [];
      anotherThatDoesntExist = [];
    }

    @SwaggerDocs(TestApiDocs)
    // @ts-ignore
    class TestController {
      async get() {
        return { data: [] };
      }
    }

    expect(Logger.error).toBeCalledTimes(0);
    expect(Logger.warn).toBeCalledTimes(2);
    expect(Logger.log).toBeCalledTimes(0);
  });

  it(
    `should issue a warning if a property on the controller doesn't have a ` +
      `matching parameter in the docs container.`,
    () => {
      class TestApiDocs {
        get = [];
      }

      @SwaggerDocs(TestApiDocs)
      // @ts-ignore
      class TestController {
        async get() {
          return { data: [] };
        }

        async documentationDoesntExist1() {
          return {};
        }

        async documentationDoesntExist2() {
          return {};
        }

        async documentationDoesntExist3() {
          return {};
        }
      }

      expect(Logger.error).toBeCalledTimes(0);
      expect(Logger.warn).toBeCalledTimes(3);
      expect(Logger.log).toBeCalledTimes(0);
    }
  );

  it(
    'should not issue mismatching property warnings for the ' +
      'ApiExtraModels property (if present).',
    () => {
      class TestApiDocs {
        get = [];
        ApiExtraModels = [];
      }

      @SwaggerDocs(TestApiDocs)
      // @ts-ignore
      class TestController {
        async get() {
          return { data: [] };
        }
      }

      expect(Logger.error).toBeCalledTimes(0);
      expect(Logger.warn).toBeCalledTimes(0);
      expect(Logger.log).toBeCalledTimes(0);
    }
  );

  it(
    'should apply specified swagger decorators to the correct properties ' +
      'in the controller class.',
    () => {
      // set up spies an mock decorators
      class SpyableHoster {
        static mDecor1 = (a, b, c) => c;
        static mDecor2 = (a, b, c) => c;
        static mDecor3 = (a, b, c) => c;
        static mDecor4 = (a, b, c) => c;
        static mDecor5 = (a, b, c) => c;
      }

      jest.spyOn(SpyableHoster, 'mDecor1');
      jest.spyOn(SpyableHoster, 'mDecor2');
      jest.spyOn(SpyableHoster, 'mDecor3');
      jest.spyOn(SpyableHoster, 'mDecor4');
      jest.spyOn(SpyableHoster, 'mDecor5');

      jest
        .spyOn(SwaggerLib, 'ApiOperation')
        .mockImplementation((o) => SpyableHoster.mDecor1);
      jest
        .spyOn(SwaggerLib, 'ApiOkResponse')
        // @ts-ignore
        .mockImplementation((o) => SpyableHoster.mDecor2);
      jest
        .spyOn(SwaggerLib, 'ApiBadRequestResponse')
        // @ts-ignore
        .mockImplementation((o) => SpyableHoster.mDecor3);
      jest
        .spyOn(SwaggerLib, 'ApiBody')
        .mockImplementation((o) => SpyableHoster.mDecor4);
      jest
        .spyOn(SwaggerLib, 'ApiParam')
        .mockImplementation((o) => SpyableHoster.mDecor5);

      // ===================

      class TestApiDocs {
        method1 = [ApiOperation({ summary: 'ApiOperation summary test' })];
        method2 = [
          ApiOperation({}),
          ApiOkResponse(),
          ApiBadRequestResponse(),
          ApiBody({})
        ];
        method3 = [
          ApiOkResponse(),
          ApiParam({ name: 'test1' }),
          ApiParam({ name: 'test2' })
        ];
      }

      @SwaggerDocs(TestApiDocs)
      // @ts-ignore
      class TestController {
        async method1() {
          return { data: [] };
        }

        async method2() {
          return {};
        }

        async method3() {
          return {};
        }
      }

      const getDescriptor = (methodName) =>
        Object.getOwnPropertyDescriptor(TestController.prototype, methodName);

      expect(SpyableHoster.mDecor1).toBeCalledTimes(2);
      expect(SpyableHoster.mDecor1).toBeCalledWith(
        TestController,
        'method1',
        getDescriptor('method1')
      );
      expect(SpyableHoster.mDecor1).toBeCalledWith(
        TestController,
        'method2',
        getDescriptor('method2')
      );

      expect(SpyableHoster.mDecor2).toBeCalledTimes(2);
      expect(SpyableHoster.mDecor2).toBeCalledWith(
        TestController,
        'method2',
        getDescriptor('method2')
      );
      expect(SpyableHoster.mDecor2).toBeCalledWith(
        TestController,
        'method3',
        getDescriptor('method3')
      );

      expect(SpyableHoster.mDecor3).toBeCalledTimes(1);
      expect(SpyableHoster.mDecor3).toBeCalledWith(
        TestController,
        'method2',
        getDescriptor('method2')
      );

      expect(SpyableHoster.mDecor4).toBeCalledTimes(1);
      expect(SpyableHoster.mDecor4).toBeCalledWith(
        TestController,
        'method2',
        getDescriptor('method2')
      );

      expect(SpyableHoster.mDecor5).toBeCalledTimes(2);
      expect(SpyableHoster.mDecor5).toBeCalledWith(
        TestController,
        'method3',
        getDescriptor('method3')
      );
      expect(SpyableHoster.mDecor5).toBeCalledWith(
        TestController,
        'method3',
        getDescriptor('method3')
      );

      expect(Logger.error).toBeCalledTimes(0);
      expect(Logger.warn).toBeCalledTimes(0);
      expect(Logger.log).toBeCalledTimes(0);
    }
  );

  it(
    `should apply decorators even when other properties' decorator ` +
      `lists have errors.`,
    () => {
      jest.spyOn(SwaggerLib, 'ApiOperation').mockImplementation((o) => {
        return MockUtils.mockMethodDecorator;
      });

      class TestApiDocs {
        // tslint:disable-next-line:no-empty
        fail = [() => {}];
        get = [ApiOperation({ summary: 'ApiOperation summary test' })];
      }

      @SwaggerDocs(TestApiDocs)
      // @ts-ignore
      class TestController {
        async get() {
          return { data: [] };
        }

        async fail() {
          return {};
        }
      }

      expect(SwaggerLib.ApiOperation).toBeCalledWith({
        summary: 'ApiOperation summary test'
      });
      // make sure the ApiOperation decorator is correctly directed to the controller's property
      expect(MockUtils.mockMethodDecorator).toBeCalledWith(
        TestController,
        'get',
        Object.getOwnPropertyDescriptor(TestController.prototype, 'get')
      );

      expect(Logger.error).toBeCalledTimes(1);
      expect(Logger.warn).toBeCalledTimes(0);
      expect(Logger.log).toBeCalledTimes(0);
    }
  );

  it('should call ApiExtraModels if the docs container is configured to do so.', () => {
    jest.spyOn(SwaggerLib, 'ApiOperation').mockImplementation((o) => {
      return MockUtils.mockMethodDecorator;
    });
    jest.spyOn(SwaggerLib, 'ApiExtraModels').mockImplementation((o) => {
      return MockUtils.mockClassDecorator;
    });

    class DummyExtraModel {}

    class TestApiDocs {
      get = [ApiOperation({ summary: 'ApiOperation summary test' })];
      ApiExtraModels = [DummyExtraModel];
    }

    @SwaggerDocs(TestApiDocs)
    // @ts-ignore
    class TestController {
      async get() {
        return { data: [] };
      }
    }

    expect(SwaggerLib.ApiOperation).toBeCalledWith({
      summary: 'ApiOperation summary test'
    });
    // make sure that the ApiOperation decorator is correctly directed to the controller's property
    expect(MockUtils.mockMethodDecorator).toBeCalledWith(
      TestController,
      'get',
      Object.getOwnPropertyDescriptor(TestController.prototype, 'get')
    );

    expect(SwaggerLib.ApiExtraModels).toBeCalledWith(DummyExtraModel);
    expect(MockUtils.mockClassDecorator).toBeCalledWith(TestController);

    expect(Logger.error).toBeCalledTimes(0);
    expect(Logger.warn).toBeCalledTimes(0);
    expect(Logger.log).toBeCalledTimes(0);
  });
});
