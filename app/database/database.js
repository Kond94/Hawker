import React from "react";

import SQLite from "react-native-sqlite-2";
import apiClient from "../api/client";

const db = SQLite.openDatabase("hawker_db.db");

const getListings = (setUserFunc) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `
        SELECT json_group_array(jsobjects) 
        FROM (
        
            SELECT json_object( 'id',
                                l.id,
                                'title',
                                l.title,
                                'description',
                                l.description,
                                'price',
                                l.price,
                                'images', 
                                json_group_array(json_object('url', i.url))) jsobjects
            FROM listings l, images i
            JOIN listings_images li ON li.listing = l.id AND li.image = i.id
            group by l.id 
        ) jo ;
      `,
        [],
        (_, { rows: { _array } }) => {
          setUserFunc(
            JSON.parse(_array[0]["json_group_array(jsobjects)"]).map((l) => {
              return {
                ...l,
                images: l.images.map((image) => image.url),
              };
            })
          );
        }
      );
    },
    (t, error) => {
      console.log("db error load users", t);
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
        "insert into listings (id, title, description, price) values (?,?,?,?)",
        [listing.id, listing.title, listing.description, listing.price]
      );
      listing.images.forEach((image) => {
        tx.executeSql("insert or ignore into images (id, url) values (?,?)", [
          image.id,
          image.url,
        ]);
        tx.executeSql(
          "insert or ignore into listings_images (listing, image) values (?,?)",
          [listing.id, image.id]
        );
      });
    },
    (t, error) => {
      console.log("db error insert Listing");
      console.log("err: ", t);
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
          "create table if not exists listings (id integer primary key not null, title text, description text, price numeric);"
        );
        tx.executeSql(
          "create table if not exists images (id integer primary key not null, url text);"
        );
        tx.executeSql(
          "CREATE TABLE if not exists listings_images(listing INTEGER, image INTEGER, FOREIGN KEY(listing) REFERENCES listings(id), FOREIGN KEY(image) REFERENCES images(id))"
        );
      },
      (_, error) => {
        console.log("db error creating tables");
        console.log(_);
        reject(error);
      },
      (_, success) => {
        resolve(success);
      }
    );
  });
};

export const database = {
  getListings,
  insertListing,
  setupDatabaseAsync,
  dropDatabaseTablesAsync,
};
