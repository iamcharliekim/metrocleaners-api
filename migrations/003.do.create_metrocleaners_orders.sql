CREATE TABLE metrocleaners_orders (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    order_number TEXT NOT NULL,
    clerk INTEGER REFERENCES metrocleaners_clerks(id) ON DELETE SET NULL,
    customer INTEGER REFERENCES metrocleaners_customers(id) ON DELETE SET NULL,
    phone_number TEXT NOT NULL,
    order_date TIMESTAMP NOT NULL, 
    ready_by_date TIMESTAMP NOT NULL,
    price TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    picked_up BOOLEAN DEFAULT false NOT NULL,
    paid BOOLEAN DEFAULT false NOT NULL,
    notification_sent BOOLEAN DEFAULT false NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
);
