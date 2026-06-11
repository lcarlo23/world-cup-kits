import request from 'supertest';
import express from 'express';
import { ObjectId } from 'mongodb';

import productsRoute from '../routes/products.js';
import ordersRoute from '../routes/orders.js';
import usersRoute from '../routes/users.js';
import reviewsRoute from '../routes/reviews.js';

import { initDb, getDb, closeDb } from '../db/connect.js';

const app = express();
app.use(express.json());
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);
app.use('/users', usersRoute);
app.use('/reviews', reviewsRoute);

const productId = new ObjectId();
const orderId = new ObjectId();
const userId = new ObjectId();
const reviewId = new ObjectId();

describe('Get and GetAll Tests', () => {
  beforeAll(async () => {
    process.env.MONGODB_URI = process.env.MONGO_URL;

    await initDb();
    const db = getDb();

    await db.collection('products').insertOne({
      _id: productId,
      name: 'Italy 2006 Home Kit',
      price: 89.99,
    });

    await db.collection('orders').insertOne({
      _id: orderId,
      customerName: 'Mario Rossi',
      totalPrice: 89.99,
    });

    await db.collection('users').insertOne({
      _id: userId,
      name: 'Luigi',
      email: 'luigi@example.com',
    });

    await db.collection('reviews').insertOne({
      _id: reviewId,
      productName: 'Italy Home Jersey 2006',
      reviewerName: 'John Doe',
      rating: 5,
      comment: 'The stitch quality is incredible. Highly recommend!',
      reviewDate: '2026-06-10',
    });
  });

  afterAll(async () => {
    await closeDb();
  });

  // --- TEST PRODUCTS ---
  describe('Products Routes', () => {
    test('GET /products - should return all products', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toBe('Italy 2006 Home Kit');
    });

    test('GET /products/:id - should return a single product', async () => {
      const res = await request(app).get(`/products/${productId.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Italy 2006 Home Kit');
    });
  });

  // --- TEST ORDERS ---
  describe('Orders Routes', () => {
    test('GET /orders - should return all orders', async () => {
      const res = await request(app).get('/orders');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].customerName).toBe('Mario Rossi');
    });

    test('GET /orders/:id - should return a single order', async () => {
      const res = await request(app).get(`/orders/${orderId.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.customerName).toBe('Mario Rossi');
    });
  });

  // --- TEST USERS ---
  describe('Users Routes', () => {
    test('GET /users - should return all users', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toBe('Luigi');
    });

    test('GET /users/:id - should return a single user', async () => {
      const res = await request(app).get(`/users/${userId.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Luigi');
    });
  });

  // --- TEST REVIEWS ---
  describe('Reviews Routes', () => {
    test('GET /reviews - should return all reviews', async () => {
      const res = await request(app).get('/reviews');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].reviewerName).toBe('John Doe');
    });

    test('GET /reviews/:id - should return a single review', async () => {
      const res = await request(app).get(`/reviews/${reviewId.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.reviewerName).toBe('John Doe');
      expect(res.body.productName).toBe('Italy Home Jersey 2006');
    });
  });
});
