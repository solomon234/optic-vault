
CREATE TABLE patient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,  -- It's common for last name to be required
    email TEXT UNIQUE,  -- Added UNIQUE constraint for email to avoid duplicates
    phoneNumber TEXT,
    birthDate DATE,
    address TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescription (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER NOT NULL,
    osSphere TEXT NOT NULL,  -- Prescriptions typically require these fields
    osCylinder TEXT,
    osAxis INTEGER CHECK (osAxis BETWEEN 0 AND 180),
    osPrism INTEGER CHECK (osPrism >= 0),  -- Prism values are usually non-negative
    osBase TEXT CHECK (osBase IN ('IN', 'OUT', 'UP', 'DOWN')),  -- Base direction is commonly constrained
    osAdd TEXT,
    osPD INTEGER CHECK (osPD >= 0),  -- PD (Pupillary Distance) is non-negative
    odSphere TEXT NOT NULL,
    odCylinder TEXT,
    odAxis INTEGER CHECK (odAxis BETWEEN 0 AND 180),
    odPrism INTEGER CHECK (odPrism >= 0),
    odBase TEXT CHECK (odBase IN ('IN', 'OUT', 'UP', 'DOWN')),
    odAdd TEXT,
    odPD INTEGER CHECK (odPD >= 0),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rxDate DATE,
    comments TEXT,
    FOREIGN KEY (patientId) REFERENCES patient(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE order_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER NOT NULL,
    prescriptionId INTEGER NOT NULL,
    total REAL NOT NULL DEFAULT 0.0,
    status TEXT,
    comments TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES patient (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (prescriptionId) REFERENCES prescription (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE order_detail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productType TEXT NOT NULL,
    frame TEXT,
    lens TEXT,
    description TEXT,
    price REAL NOT NULL DEFAULT 0.0,
    tax REAL NOT NULL DEFAULT 0.0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES order_summary (id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table setting (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    value TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE INDEX idx_prescription_patient ON prescription(patientId);
CREATE INDEX idx_orders_patient ON order_summary (patientId);
CREATE INDEX idx_orders_prescription ON order_summary (prescriptionId);
CREATE INDEX idx_order_details_order ON order_detail (orderId);

insert into setting (type, value) values ('tax', '8.875');