import React from "react";

import * as SQLite from "expo-sqlite";
import apiClient from "../api/client";

const db = SQLite.openDatabase("hawker_db.db");

const getListings = (setUserFunc) => {
  db.transaction(
    (tx) => {
      tx.executeSql("select * from listings", [], (_, { rows: { _array } }) => {
        setUserFunc(_array);
      });
    },
    (t, error) => {
      console.log("db error load users");
    },
    (_t, _success) => {
      console.log("loaded listings");
    }
  );
};

const insertListing = (listing, successFunc) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        "insert into listings (id, title, description, price, imageUrl) values (?,?,?,?,?)",
        [
          listing.id,
          listing.title,
          listing.description,
          listing.price,
          apiClient.getBaseURL().replace("/api", "") + listing.imageUrl,
        ]
      );
    },
    (t, error) => {
      console.log("db error insert Listing");
      console.log("err: ", error);
    },
    (t, success) => {
      successFunc();
    }
  );
};

const dropDatabaseTablesAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "drop table if exists listings",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          console.log("error dropping listings table");
          reject(error);
        }
      );
    });
  });
};

const setupDatabaseAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists listings (id integer primary key not null, title text, description text, price numeric, imageUrl text);"
        );
      },
      (_, error) => {
        console.log("db error creating tables");
        console.log(error);
        reject(error);
      },
      (_, success) => {
        resolve(success);
      }
    );
  });
};

const setupListingsAsync = async () => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into listings (id, title, description, price, imageUrl) values (?,?,?,?,?)",
          [
            6,
            "Seeded Couch",
            "This couch is a test for sqlite",
            12.2,
            "http://192.168.43.10:1337/uploads/large_couch_4f9fe20023.jpg",
          ]
        );
      },
      (t, error) => {
        console.log("db error insert Listing Setup function");
        console.log(error, t);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};

export const database = {
  getListings,
  insertListing,
  setupDatabaseAsync,
  setupListingsAsync,
  dropDatabaseTablesAsync,
};
