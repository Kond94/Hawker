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
                                'author',
                                json_object('username', a.username),
                                'category',
                                json_object('name', c.name),
                                'images', 
                                json_group_array(json_object('url', i.url))) jsobjects
            FROM listings l, images i, authors a, categories c
            INNER JOIN authors ON authors.id = l.author
            INNER JOIN categories ON categories.id = l.category
            JOIN listings_images li ON li.listing = l.id AND li.image = i.id
            group by l.id) jo ;
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
      console.log("db error load listings", t);
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
        "insert or ignore into authors (id, username) values (?,?)",
        [listing.author.id, listing.author.username]
      );
      tx.executeSql(
        "insert or ignore into categories (id, name, icon, backgroundColor, color) values (?,?,?,?,?)",
        [
          listing.category.id,
          listing.category.name,
          listing.category.icon,
          listing.category.backgroundColor,
          listing.category.color,
        ]
      );

      tx.executeSql(
        "insert into listings (id, title, description, price, author, category) values (?,?,?,?,?,?)",
        [
          listing.id,
          listing.title,
          listing.description,
          listing.price,
          listing.author.id,
          listing.category.id,
        ]
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
          "create table if not exists authors (id integer primary key not null, username text);"
        );
        tx.executeSql(
          "create table if not exists categories (id integer primary key not null, name text, icon text, backgroundColor text, color text);"
        );
        tx.executeSql(
          "create table if not exists listings (id integer primary key not null, title text, description text, price numeric, updatedAt text, author INTEGER, category INTEGER, FOREIGN KEY(author) REFERENCES authors(id),  FOREIGN KEY(category) REFERENCES categories(id));"
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
