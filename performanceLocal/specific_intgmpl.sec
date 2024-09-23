var x11 integer >=0;
var x12 integer >=0;
var x21 integer >=0;
var x22 binary >=0; 

minimize transportkosten: 4*x11 + 6*x12 + 5*x21 + 3*x22;
subject to lager1kap: x11+x12 <= 60;
s.t. lager2kap: x21+x22 <= 40.5;
s.t. ziel1bedarf: x21+x11 = 50;
s.t. ziel2bedarf: x12+x22 = 50;