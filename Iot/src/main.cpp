#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_ADXL345_U.h>
#include <WiFi.h> 
#include <DHT.h>
#include <DHT_U.h>
const char* agAdi = "redmi12"; 
const char* agSifresi = "yusuf2003"; 
float temperature = 0.0;
int currentX = 0; 
int currentY = 0;
int currentZ = 0;
int gasStatus = 0;  
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);
WiFiClient client;
#define DHTPIN 15  
#define DHTTYPE DHT11  
DHT dht(DHTPIN, DHTTYPE);
int esikDegeri = 700;
int xEsikDegeri = 1; 
int yEsikDegeri = 1; 
int zEsikDegeri = 1; 
int deger = 0;

int16_t ax, ay, az;

void connectToWiFi() {
    Serial.println("WiFi'ye bağlanıyor...");

    WiFi.begin(agAdi, agSifresi); 
    
    while (WiFi.status() != WL_CONNECTED) {
         
        delay(1000);
        Serial.println("Bağlanıyor...");
        digitalWrite(14, LOW);
    }
    Serial.println("Bağlandı! IP adresi: ");
    digitalWrite(14, HIGH);
    Serial.println(WiFi.localIP());
}

void sendDataToAPI() {
    digitalWrite(25, HIGH);  // Yeşil LED
    if (!client.connected()) {
        Serial.println("Bağlantı açılıyor...");
        if (!client.connect("192.168.123.46", 3000)) {
            Serial.println("Bağlantı hatası!");
            digitalWrite(14, LOW);
            return;
        }
        digitalWrite(14, HIGH);
    }
    String veri = "GET /test?x=" + String(ax) + 
                  "&y=" + String(ay) + 
                  "&z=" + String(az) + 
                  "&smoke=" + String(deger) + 
                  "&temperature=" + String(temperature) + 
                  "&gasstatus=" + String(gasStatus) + 
                  "&id=1 HTTP/1.1\r\n";
    veri += "Host: 195.85.216.225\r\n";
    veri += "Connection: close\r\n\r\n"; 
    client.print(veri);
    Serial.println("Veri gönderildi");

    while (client.available()) {
        String response = client.readString();
        Serial.println(response); 
    }
    client.stop(); 
    digitalWrite(25, LOW);  // Yeşil LED'i kapat
}

void setup() {
    Wire.begin(21, 22);
    Serial.begin(9600);

    if (!accel.begin()) {
        Serial.println("ADXL345 bulunamadı! Kontrol edin.");
        while (1);
    }
    Serial.println("ADXL345 bulundu!");
    pinMode(26, OUTPUT); // Kırmızı LED
    pinMode(27, OUTPUT); // Buzzer
    pinMode(25, OUTPUT); // Yeşil LED
    pinMode(34, INPUT);  // Duman/Gaz sensörü (Analog giriş)
    pinMode(14, OUTPUT);  // Mavi Led (Dijital giriş)
    pinMode(13, INPUT);
    connectToWiFi();     
}

void loop() {
    sensors_event_t event;
    accel.getEvent(&event);
    temperature = dht.readTemperature();
    ax = event.acceleration.x;
    ay = event.acceleration.y;
    az = event.acceleration.z;
    gasStatus = digitalRead(13);
    deger = analogRead(34);
    deger = map(deger, 0, 1023, 0, 1000); 
    Serial.print("Duman/Gaz Değeri: "); 
    Serial.print(deger);
    Serial.print("Duman/Gaz Aşım Durumu: "); 
    Serial.print(gasStatus);
    Serial.print("Sıcaklık Değeri: "); 
    Serial.print(temperature);
    Serial.print(", ADXL345 - X: ");
    Serial.print(ax);
    Serial.print(", Y: ");
    Serial.print(ay);
    Serial.print(", Z: ");
    Serial.println(az);
    int analogValue = analogRead(34);
    Serial.print("Analog Value: ");
    Serial.println(analogValue);
    bool alarm = false;
    if (temperature > 29){
        Serial.println(" - yüksek Sıcaklık"); 
        alarm = true;
    }
    if (gasStatus == 0) {
        Serial.println(" - yüksek duman veya gaz"); 
        alarm = true;
    }
    if (abs(ax - currentX) > xEsikDegeri) {
        Serial.println(" - X ekseni için eşik değeri aşıldı");
        alarm = true; 
    }
    if (abs(ay - currentY) > yEsikDegeri) {
        Serial.println(" - Y ekseni için eşik değeri aşıldı");
        alarm = true; 
    }
    if (abs(az - currentZ) > zEsikDegeri) {
        Serial.println(" - Z ekseni için eşik değeri aşıldı");
        alarm = true; 
    }
    currentX = ax;
    currentY = ay;
    currentZ = az;
    if (alarm) {
        digitalWrite(26, HIGH);  // Kırmızı LED
        digitalWrite(27, HIGH);  // Buzzer
        digitalWrite(25, LOW);   // Yeşil LED
        delay(100);
        digitalWrite(26, LOW);   // Kırmızı LED kapalı
        digitalWrite(27, LOW);   // Buzzer kapalı
    } else {
        Serial.println(" - normal değerler");
        digitalWrite(26, LOW);   // Kırmızı LED kapalı
        digitalWrite(27, LOW);   // Buzzer kapalı
        digitalWrite(25, LOW);   // Yeşil LED kapalı
    }

    static unsigned long lastSendTime = 0;
    if (millis() - lastSendTime >= 1000) { 
        sendDataToAPI();
        lastSendTime = millis();
    }
    delay(100);
}
