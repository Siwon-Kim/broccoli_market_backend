const ProductsController = require("../../../controllers/products.controller.js");
const { productSchema } = require("../../../middlewares/joi")

let mockProductsService = {
  createProduct: jest.fn(),
  findAllProducts: jest.fn(),
  findDetailProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  makeProductSold: jest.fn(),
  searchProduct: jest.fn()
};

let mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
  query: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: jest.fn(),
};

const next = jest.fn();

let productsController = new ProductsController();

// productsController의 Service를 Mock Service로 변경합니다.
productsController.productsService = mockProductsService;

describe("Layered Architecture Pattern Products Controller Unit Test", () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
      jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  
      // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
      mockResponse.status = jest.fn(() => {
        return mockResponse;
      });
    });

    test("products.controller createProduct 성공", async () => {
      // 준비
      const resLocalsUser = {
        user_id: "test",
        id: 1,
      };
      const reqBody = {
        title: "타이틀",
        content: "컨텐츠",
        price: 10000,
        category: "테스트",
        photo_ip: "0.0.0.0",
      };

      mockResponse.locals.user = resLocalsUser;
      mockRequest.body = reqBody;

      const createProductReturnValue = {
        product_id: 1,
        user_id: 1,
        user_info_id: 1,
        title: "타이틀",
        content: "컨텐츠",
        price: 10000,
        category: "테스트",
        chat_count: 0,
        likes: 0,
        views: 0,
        is_sold: 0,
        photo_ip: "0.0.0.0",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };
      mockProductsService.createProduct = jest.fn(() => {
        return createProductReturnValue;
      });

      // 실행
      const { value, error } = productSchema.validate(mockRequest.body);
      await productsController.createProduct(mockRequest, mockResponse);

      // 검증
      // 1. req.body 데이터가 정상적인 경우
      expect(error).toBeUndefined();

      // 2. locals.user와 body 데이터가 정상적으로 createProduct에 전달되었는 지 확인
      expect(mockProductsService.createProduct).toHaveBeenCalledTimes(1);
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(
        resLocalsUser.user_id,
        resLocalsUser.id,
        reqBody.title,
        reqBody.content,
        reqBody.price,
        reqBody.category,
        reqBody.photo_ip,
      );

      // 3. mockResponse.json을 호출할 때 메세지가 정상 반환되는 지 확인
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "상품 생성 완료" });

      // 4. mockResponse.status의 statuscode 201 확인
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    test("products.controller createProduct 검증 실패", async () => {
      // 준비
      const resLocalsUser = {
        user_id: "test",
        id: 1,
      };
      const reqBody = {
        // title: "타이틀",
        content: "컨텐츠",
        price: 10000,
        category: "테스트",
        photo_ip: "0.0.0.0",
      };
      
      mockResponse.locals.user = resLocalsUser;
      mockRequest.body = reqBody;

      // 실행
      const { value, error } = productSchema.validate(mockRequest.body);
      
      // 검증
      expect(error).toBeDefined();
    });

    test("products.controller getAllProduct 성공", async () => {
      // 준비
      const allProducts = [];
      for (let i = 1; i <= 10; i++){
        allProducts.push({
          product_id: i,
          user_id: i,
          user_info_id: i,
          title: `타이틀${i}`,
          content: `컨텐츠${i}`,
          price: 10000,
          category: `테스트${i}`,
          chat_count: 0,
          likes: 0,
          views: 0,
          is_sold: 0,
          photo_ip: "0.0.0.0",
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
        });
      };

      mockProductsService.findAllProducts = jest.fn(() => {
        return allProducts;
      })
    
      // 실행
      await productsController.getAllProduct(mockRequest, mockResponse, next);

      // 검증
      // 1. 메서드가 정상 호출 되었는 지 확인
      expect(mockProductsService.findAllProducts).toHaveBeenCalledTimes(1);
      
      // 2. mockResponse.json을 호출할 때 값이 정상 반환되는 지 확인
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({ products: allProducts });

      // 3. mockResponse.status의 statuscode 200 확인
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    test("products.controller getAllProduct 실패", async () => {
      // 준비
      
    
      // 실행




      // 검증



    });

    test("products.controller getDetailProduct 성공", async () => {
      // 준비
      const product = {
        product_id: 1,
        user_id: 1,
        user_info_id: 1,
        title: "타이틀",
        content: "컨텐츠",
        price: 10000,
        category: "테스트",
        chat_count: 0,
        likes: 0,
        views: 0,
        is_sold: 0,
        photo_ip: "0.0.0.0",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };
      mockProductsService.findDetailProduct = jest.fn(() => {
        return product;
      });
    
      // 실행
      await productsController.getDetailProduct(mockRequest, mockResponse ,next);

      // 검증
      // 1. 메서드가 정상 호출 되었는 지 확인
      expect(mockProductsService.findDetailProduct).toHaveBeenCalledTimes(1);
      
      // 2. mockResponse.json을 호출할 때 값이 정상 반환되는 지 확인
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({ product });

      // 3. mockResponse.status의 statuscode 200 확인
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    test("products.controller getDetailProduct 실패", async () => {
      // 준비
      
    

      // 실행



      // 검증



    });

    test("products.controller updateProduct 성공", async () => {
      // 준비
      
    

      // 실행



      // 검증



    });

    test("products.controller updateProduct 실패", async () => {
      // 준비
      
    

      // 실행



      // 검증



    });

    test("products.controller deleteProduct 성공", async () => {
      // 준비
      
    

      // 실행



      // 검증



    });

    test("products.controller deleteProduct 실패", async () => {
      // 준비
      
    

      // 실행



      // 검증



    });

    test("products.controller makeProductSold 성공", async () => {
      // 준비
      
    

      // 실행



      // 검증



    });

    test("products.controller makeProductSold 실패", async () => {
      // 준비
      
    

      // 실행



      // 검증



    });

});