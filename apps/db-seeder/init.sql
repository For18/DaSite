DELETE FROM Sales;
DELETE FROM AuctionEntries;

UPDATE Products SET ThumbnailImageId=NULL;

DELETE FROM Auctions;
DELETE FROM AuctionItems;
DELETE FROM ProductImages;
DELETE FROM Products;
DELETE FROM AspNetUsers;

-- Using manual id assignment so auto increment does not get involved

-- USERS
INSERT INTO AspNetUsers(Id, UserName, AuctionDebt, AvatarImageUrl, Email, EmailConfirmed, TelephoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockOutEnabled, AccessFailedCount)
VALUES
(1, 'Robbert Young', 0, 'https://i.redd.it/g28z3ezfxqm51.jpg', 'HS@maestro.flora.nl', 1, 987654374, 1, 1, 2, 0),
(2, 'Hán Zhì', 0, 'https://imgur.com/a/XazVj4C', 'HZ@admin.flora.nl', 1, 876556789, 1, 1, 1, 0),
(3, 'Maria de Vries', 0, 'https://media.licdn.com/dms/image/v2/D5603AQFVPGrisNSyuQ/profile-displayphoto-shrink_200_200/B56ZWa8r1_GQAY-/0/1742061355032?e=2147483647&v=beta&t=Cw8eo8Snvn8nphEkLqW2kRHMHVM6OKKSyM3akYe81ks', 'Maria.deVries@live.nl', 1, 8798000, 1, 1, 1, 0),
(4, 'Joris van den Berg', 0, 'https://www.hevo.nl/application/files/cache/thumbnails/hevo-joris-van-den-berg-0a83fb5ddae97038540dbc5d1966978a.jpg', 'Joris.vanBerg@live.nl', 1, 345678, 1, 1, 1, 0),
(5, 'Casper van de Molen', 500, 'https://i.pinimg.com/originals/59/af/9c/59af9cd100daf9aa154cc753dd58316d.jpg', 'Casper.Molen@gmail.com', 1, 9876587, 1, 1, 1, 0),
(6, 'Thijmen Weening', 22450, 'https://media.licdn.com/dms/image/D4E22AQFIp_NIUQ1TNw/feedshare-shrink_800/0/1689671627197?e=2147483647&v=beta&t=LeRJwHti1AGLuNVboxNY7RN82QNZXbNSINIswOsRtkg', 'Thijmen.ween.2001@live.nl', 1, 8678675654, 1, 1, 1, 0),
(7, 'Hans Anders', 88760, 'https://media.licdn.com/dms/image/D4E03AQEr-eBEB30FvQ/profile-displayphoto-shrink_800_800/0/1697558265625?e=2147483647&v=beta&t=lGipnIlcV5JEh1AEwNdzY0Vc11hw_Be8Po7ALIcV4VM', 'Hans@hotmail.com', 1, 876548, 1, 1, 1, 0);


-- PRODUCTS
INSERT INTO Products(Id, Name, Description, ThumbnailImageId, OwnerId)
VALUES
(1, 'Tulpenboeket', 'Een kleurrijk boeket met verschillende soorten Nederlandse tulpen, ideaal voor elke gelegenheid en perfect voor een lente-uitstraling.', NULL, 3),
(2, 'Orchideeen Arrangement', 'Een prachtig arrangement van exotische orchideeen, met een delicate geur, gepresenteerd in een handgemaakte vaas. Een luxe keuze voor elke ruimte.', NULL, 3),
(3, 'Narcissen Bijeenkomst', 'Vers geplukte narcissen in een bundel, die een frisse geur en een voorjaarsgevoel naar uw huis brengen. Perfect voor in een vaas of als cadeau.', NULL, 3),
(4, 'Zonnebloem Display', 'Een stralende display van zonnebloemen die elke kamer verlicht met hun heldere gele bloemblaadjes. Een symbool van vreugde en positiviteit.', NULL, 4),
(5, 'Hyacinten Cluster', 'Een geurige en kleurrijke cluster van hyacinten, typisch voor de Nederlandse lente, in een breed scala van kleuren, perfect voor een geurige aanvulling in uw huis.', NULL, 4),
(6, 'Leliebouquet', 'Een elegant boeket van witte en gekleurde lelies met een verfijnde geur, die elke ruimte een luxe uitstraling geven. Ideaal voor speciale gelegenheden.', NULL, 4),
(7, 'Krokus Collectie', 'Een unieke verzameling van vroege krokussen, die in het voorjaar de eerste bloemen zijn die bloeien', NULL, 4),
(8, 'Tulpenbollen Set', 'Een set premium tulpenbollen, zorgvuldig geselecteerd voor het kweken van de mooiste tulpen in uw tuin volgend seizoen. De bollen zijn van topkwaliteit en leveren levendige bloemen.', NULL, 4),
(9, 'Gerbera Daisy Arrangement', 'Een vrolijk en kleurrijk boeket van gerbera’s in diverse tinten zoals rood, geel en roze. Perfect voor het opfleuren van elke kamer of als cadeau voor een speciale gelegenheid.', NULL, 3);

-- PRODUCT_IMAGES
INSERT INTO ProductImages(Id, ParentId, Url)
VALUES
-- Tulpenboeket
(1, 1, 'https://webservice.topbloemen.nl/image/593607800/34190918.jpg'),
(2, 1, 'https://www.setafiori.nl/wp-content/uploads/2024/02/3392DF4F-519E-4F07-B21F-F7699E42AD36_1_105_c.jpeg'),
(3, 1, 'https://2.bp.blogspot.com/-EF-ZsrSQQhA/VS1nvPwVT1I/AAAAAAAA07A/8MwhNd5p0Hc/w1200-h630-p-k-no-nu/lente%2Bboeket%2Bmet%2Btulpen.jpg'),
 
-- Orchideeen
(4, 2, 'https://i.imgur.com/TKyjCGD.png'),
(5, 2, 'https://i.imgur.com/1Jq57B5.png'),
(6, 2, 'https://i.imgur.com/8y9RWX7.png'),
(7, 2, 'https://i.imgur.com/L31jYOF.png'),

-- Narcissen
(8, 3, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fnl-nl.bakker.com%2Fcdn%2Fshop%2Ffiles%2F100525_2.jpg%3Fv%3D1706170714%26width%3D1946&f=1&nofb=1&ipt=b8725e624447796c736a0faa93d3e61d340312ccb046637c8ece3921bafdb311'),
(9, 3, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fblog.dutch-bulbs.com%2Fwp-content%2Fuploads%2F2024%2F06%2Fguide-for-daffodils.jpg&f=1&nofb=1&ipt=555301a96f0958e3418f99f04c8f0b658a26d6f0cdd6dd1a7cb5294d4c0dd40e'),
(10, 3, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.ikbouwvanjou.nl%2Fwp-content%2Fuploads%2Fhoe-narcissen-verzorgen.jpg&f=1&nofb=1&ipt=6b5b6475d189740f17333af81b58a5aeae05968f90f341789092f7e70a6f838d'),

-- Zonnebloem
(11, 4, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.zonnebloem.nl%2F~%2Fmedia%2Fmijn-zonnebloem%2Fafdelingen%2Fwebsites%2Fupload%2Fnieuwenhagen%2F2022%2F7%2F1%2Fzonnebloemenjpg.jpg%3Fmw%3D800&f=1&nofb=1&ipt=077a774dd47df76c0f4d1ef41153e6abfb8e3ef6ca3a3d395fe54643191f618a'),
(12, 4, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.tijdvoorjetuin.nl%2Fwp-content%2Fuploads%2F2019%2F05%2Fshutterstock_271249412.jpg&f=1&nofb=1&ipt=4f9166cf7193f5e3edc92a0db4ae1574e299c02e8998651de63c47b5ca6d6ca6'),
(13, 4, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.gardenersworldmagazine.nl%2Fapp%2Fuploads%2F2022%2F04%2Fzonnebloemen-kweken.jpg&f=1&nofb=1&ipt=61bd74cf40f4f7c257d03c6cd62034f21bcbcea46b5c150f80549018b30d4ce7'),
(14, 4, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.directplant.nl%2Fmedia%2Fcatalog%2Fproduct%2Fb%2Fu%2Fbuzzy_organic_helianthus_zonnebloem_zohar_f1_bio_03.jpeg%3Foptimize%3Dmedium%26fit%3Dcrop%26height%3D600%26width%3D600&f=1&nofb=1&ipt=399475d5840280e158c2b80e4483e6d3bf4c5897ecb736c7129068e8f6a19de9'),
(15, 4, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0357%2F6374%2F8923%2Farticles%2FWhatsApp_Image_2022-09-29_at_14.01.35.jpg%3Fv%3D1664455936%26width%3D1100&f=1&nofb=1&ipt=eac97e3c3b3a2cc6eb988f8379666a6a08626b9e8e30babfb32b01c81b291f01'),

-- Hyacinten
(16, 5, 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ffloratuin.com%2Fcdn%2Fshop%2Fproducts%2FHyacintFondant.jpg%3Fv%3D1680345199&f=1&nofb=1&ipt=0a8e143f0f87562803ef17a6bba3fde0da54c4bbe0d12700a380340ff3182ed4'),
(17, 5, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fblog.dutch-bulbs.com%2Fwp-content%2Fuploads%2F2024%2F10%2Fhyacinths-in-garden-design.jpg&f=1&nofb=1&ipt=7c20715c76bf159051119cca7a33202c94c141c10d211fc4558513525e05eb1a'),
(18, 5, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Finspiratie.groenrijk.nl%2Fwp-content%2Fuploads%2F020-209080-Hyacinthus.jpg&f=1&nofb=1&ipt=03564f1025347bd056160dabe8d4c9fa6ed5366c5354099eaa215ebf07eac603'),
(19, 5, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fblog.dutch-bulbs.com%2Fwp-content%2Fuploads%2F2024%2F05%2Fguide-for-hyacinths-2-768x534.jpg&f=1&nofb=1&ipt=b57731155962239fcfcaa7ce5588403aebbe8ddb9469c677b0fe959f920c82cd'),

-- Leliebouqet
(20, 6, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Fthumb_back%2Ffh260%2Fbackground%2F20230426%2Fpngtree-white-lily-flower-with-black-background-image_2521376.jpg&f=1&nofb=1&ipt=decb90aff60c31a3f610a51e2b44abe915ec0bca5a776565b80df3e5391dc810'),
(21, 6, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2018%2F07%2F26%2F12%2F43%2Flily-3563515_960_720.jpg&f=1&nofb=1&ipt=cb8244e6ef210b01ea4189be88cb40eb68c2cdc5b576b0d0a524b6baf4306151'),
(22, 6, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2016%2F12%2F14%2F17%2F56%2Flily-1907074_960_720.jpg&f=1&nofb=1&ipt=7729fe7d3fc0c8666495e747f35d8b9a2865541b3326e603ccaba2259b2c8290'),
(23, 6, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpixnio.com%2Ffree-images%2F2019%2F01%2F23%2F2019-01-23-09-34-36.jpg&f=1&nofb=1&ipt=ab0520c1c9e13f7c159e907dc50b404baebf6bce076274026f9319ee012da699'),

-- Krokus
(24, 7, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fworldoffloweringplants.com%2Fwp-content%2Fuploads%2F2017%2F05%2FCrocus.jpg&f=1&nofb=1&ipt=2a412f7591a6dbb9249c142605618e5167f9b063c1cd04421a6f1104d426a56a'),
(25, 7, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.plantura.garden%2Fwp-content%2Fuploads%2F2018%2F03%2FKrokus-17.jpg&f=1&nofb=1&ipt=4dc56734cc44e50a6372deda26a846596404b1e4797db4f15bfd15d58f64096f'),
(26, 7, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F1419%2F7120%2Fproducts%2FCrocus_Large_Flowering_Mix_778711063.SHUT_1024x.jpg%3Fv%3D1595955240&f=1&nofb=1&ipt=489cb7a1847270e60d03564b5490295a48920095573b14d5deb01473fdf3856c'),
(27, 7, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgarden.org%2Fpics%2F2019-03-18%2Fdirtdorphins%2Ff5226f.jpg&f=1&nofb=1&ipt=74319d633477f9c77c3cef969c940eb1ed21eee742276a381ca695b28ef8ca7d'),

-- Tulpenbollen
(28, 8, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fblog.dutch-bulbs.com%2Fwp-content%2Fuploads%2F2023%2F05%2Ftulip-bulbs1.png&f=1&nofb=1&ipt=c66c146ef8ff1e186caf288c22f88f3c0af1bad2e3a41a28bc88555fe73cabe2'),
(29, 8, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fa-z-animals.com%2Fmedia%2F2022%2F12%2Fshutterstock_2028495455-1536x1024.jpg&f=1&nofb=1&ipt=32b39e73005256fe4316b446cf83d6e23bc6d891fac027f40432653965a0a2b3'),
(30, 8, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0567%2F5165%2F2954%2Ft%2F2%2Fassets%2Ftulpenbol_overhouden5.jpg%3Fv%3D1670816542&f=1&nofb=1&ipt=43c22d766512f065a8a6158cc48ca986d18215c97d294a20d767572a1641f057'),
(31, 8, 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.tuinenbalkon.nl%2Fwp-content%2Fuploads%2F2011%2F10%2Fbloembollen-tulpen-bollen-poten-in-bloempot-300x200.jpg&f=1&nofb=1&ipt=de511936c9d66aacd2b1b3cce7efdfa5ab8b0b0b975ad9fe230481cc4b67bb0c'),

-- Gerbera Daisy
(32, 9, 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Feskipaper.com%2Fimages%2Fgerbera-daisies-7.jpg&f=1&nofb=1&ipt=9fe36e64587b2c42b229d5cba0c2bcebb52f5a9bc595b6ced178d0dec0b63dda'),
(33, 9, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thespruce.com%2Fthmb%2Fa8VaEiMFZw9JZO8A_PRGaQxmXnE%3D%2F4256x0%2Ffilters%3Ano_upscale()%3Amax_bytes(150000)%3Astrip_icc()%2Fgerbera-daisy-flowers-2132342-02-407a8817b72c4d30a22e514484ff5573.jpg&f=1&nofb=1&ipt=5516df73e1de160daf20b7f543123c83cd4a9bc0de85f9f15b5a0f22d93cfc13'),
(34, 9, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2FhHhZ6ou.jpg&f=1&nofb=1&ipt=8a1bfce5f2cf40c0f5c5420f45c429782b54217f1c086c07222544fe560f56a5'),
(35, 9, 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpuffycarrot.com%2Fwp-content%2Fuploads%2F2017%2F05%2FGerbera-daisies.jpg&f=1&nofb=1&ipt=2e7e7eb8bd7c89fcae161cc5d040c60db86265fd1383a77db7f8b32b66dc3472'),
(36, 9, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fownyardlife.com%2Fwp-content%2Fuploads%2F2025%2F03%2FGerbera-Daisy-Plant-Care-1-1536x864.jpg&f=1&nofb=1&ipt=6ee3cba3fbaef0e4e43c7472ab7da612663d04214eb639d5b883b910ebe0072d');

UPDATE Products SET ThumbnailImageId=1 WHERE Id=1;
UPDATE Products SET ThumbnailImageId=4 WHERE Id=2;
UPDATE Products SET ThumbnailImageId=8 WHERE Id=3;
UPDATE Products SET ThumbnailImageId=11 WHERE Id=4;
UPDATE Products SET ThumbnailImageId=16 WHERE Id=5;
UPDATE Products SET ThumbnailImageId=20 WHERE Id=6;
UPDATE Products SET ThumbnailImageId=24 WHERE Id=7;
UPDATE Products SET ThumbnailImageId=28 WHERE Id=8;
UPDATE Products SET ThumbnailImageId=32 WHERE Id=9;


-- AUCTIONS
INSERT INTO Auctions(Id, PlannerId, StartingTime)
VALUES
(1, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(2, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(3, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(4, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(5, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(6, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(7, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(8, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(9, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(10, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(11, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(12, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000),
(13, 1, UNIX_TIMESTAMP()*1000 + RAND()*900000 + 1800000);

-- AUCTION_ITEMS
INSERT INTO AuctionItems(Id, Count, BatchSize, StartingPrice, MinimumPrice, Length, ProductId)
VALUES
(1, 1, 2 , 5000, 1000, 10, 1),
(2, 2, 3 , 7000, 1500, 5 , 2),
(3, 3, 6 , 3000, 800 , 10, 3),
(4, 4, 7 , 4000, 1000, 15, 4),
(5, 5, 9 , 3500, 1000, 9 , 5),
(6, 6, 20, 2500, 600 , 10, 6),
(7, 7, 2 , 1500, 500 , 7 , 7),
(8, 8, 9 , 2000, 700 , 10, 8),
(9, 9, 10, 1200, 400 , 6 , 9);

-- AUCTION_ENTRIES
INSERT INTO AuctionEntries (AuctionId, AuctionItemId)
VALUES
-- Auction 1
(1, 1), (1, 2), (1, 3),

-- Auction 2
(2, 4), (2, 5), (2, 6),

-- Auction 3
(3, 7), (3, 8), (3, 9),

-- Auction 4
(4, 1), (4, 4), (4, 7), (4, 9),

-- Auction 5
(5, 2), (5, 5), (5, 8), (5, 3),

-- Auction 6
(6, 1), (6, 3), (6, 5), (6, 7), (6, 9),

-- Auction 7
(7, 2), (7, 4), (7, 6), (7, 8), (7, 1),

-- Auction 8
(8, 3), (8, 4), (8, 5), (8, 6), (8, 7), (8, 8),

-- Auction 9
(9, 1), (9, 2), (9, 3), (9, 6), (9, 8), (9, 9),

-- Auction 10
(10, 4), (10, 5), (10, 6),

-- Auction 11
(11, 1), (11, 3), (11, 7), (11, 9),

-- Auction 12
(12, 2), (12, 4), (12, 6), (12, 8), (12, 9),

-- Auction 13
(13, 1), (13, 2), (13, 3), (13, 4), (13, 5), (13, 6);
