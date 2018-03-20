var mongoose = require ('mongoose');
const Bot= require('telegram-bot-manager');
const express = require('express');
const bot =  new Bot ("****");      //bot token
let update_id=0;
mongoose.connect("mongodb://spyFinder:09359100@localhost/spyFinder");
// mongoose.connect("mongodb://localhost/WH", {
//     useMongoClient : true
// })
var temp_removinguser;
var wh = mongoose.connection;
var UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    group_id: String,
    id : Number,
    username : String,
    date : String,
    Menu_lvl: String,
    text : String,
    group_name : String,
});
var UserModel = mongoose.model("user" , UserSchema) ;
var WhiteListSchema = new mongoose.Schema({
    adder_id: Number,
    added_id: Number,
    group_id: String,
    group_name: String,
    temp_user: Number
});

var WhModel = mongoose.model("friends" , WhiteListSchema);

var GroupsSchema= new mongoose.Schema({
   group_id : String,
   group_name : String,
    adder_id : Number
});
var GroupsModel = mongoose.model("mygroups",GroupsSchema);
var AdminSchema = new mongoose.Schema({
    admin_id : Number,
    adder_id : Number,
    group_id : String,
    group_name : String,
    temp_admin : Number,
});
var AdminModel = mongoose.model("admin",AdminSchema);
var SpySchema = new mongoose.Schema({
    group_name : String,
    group_id : String,
    adder_id : Number,
    adder_username : String,
    adder_firstname : String,
    adder_lastname : String,
    added_id : Number,
    added_username : String,
    added_firstname : String,
    added_lastname : String,
    time : String
});
var SpyModel = mongoose.model("spy",SpySchema);
var StorageSchema = new mongoose.Schema({
   adder_id: Number,
   temp_storage : String
});
var StorageModel = mongoose.model("storage",StorageSchema);
var NosySchema = new mongoose.Schema({
    chat_id : Number,
    username : String,
    first_name: String,
    last_name: String,
    time: String,
    password : String
});
var NosyModel = mongoose.model("nosy",NosySchema);

wh.on('error' , function () {
    console.log("something went wrong...");

});

wh.once('connected' , function () {
    console.log("mongoDB is connected :)")

});
function users (data){
    bot.sendMessage({
        chat_id: data["message"]["from"]["id"] ,
        text: "منوی کاربری" ,
        reply_markup: {
            keyboard: [
                [
                    {text: "بخش ادمین ها"}
                ],
                [
                    {text:"بخش اعضای معتمد"}
                ],
                [
                    {text:"بخش جاسوس ها"}
                ],
                [
                    {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                ]
            ],
            resize_keyboard: true
        }
    })
}
function groups (data){
    bot.sendMessage({
        chat_id: data["message"]["from"]["id"] ,
        text: "منوی کاربری" ,
        reply_markup: {
            keyboard: [
                [
                    {text: "بررسی وضعیت گروه ها"}
                ],
                [
                    {text: "اضافه کردن گروه"}
                ],
                [
                    {text:"حذف کردن گروه"}
                ],
                [
                    {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                ]
            ],
            resize_keyboard: true
        }
    })
}
function main_menu(data) {
    bot.sendMessage({
        chat_id: data["message"]["from"]["id"] ,
        text: "منوی کاربری" ,
        reply_markup: {
        keyboard: [
            [
                {text: "گروه ها"}
            ],
            [
                {text:"کاربران"}
            ],

        ],
            resize_keyboard: true
    }
    });

}
function admins(data) {
    bot.sendMessage({
        chat_id: data["message"]["from"]["id"] ,
        text: "منوی کاربری" ,
        reply_markup: {
            keyboard: [
                [
                    {text: "افزودن ادمین"}
                ],
                [
                    {text:"حذف ادمین"}
                ],
                [
                    {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                ],
            ],
            resize_keyboard: true
        }
    });

}
function white_list(data) {

    bot.sendMessage({
        chat_id: data["message"]["from"]["id"] ,
        text: "منوی کاربری" ,
        reply_markup: {
            keyboard: [
                [
                    {text: "بررسی وضعیت کاربر"}
                ],
                [
                    {text:"افزودن عضو معتمد"}
                ],
                [
                    {text:"حذف عضو معتمد"}
                ],
                [
                    {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                ],
            ],
            resize_keyboard: true
        }
    });

}
function add_gp(data) {
    bot.sendMessage({
        chat_id: data["message"]["from"]["id"] ,
        text: "ابتدا ربات را به گروه خود بیافزایید\n" +
        "@spyremover_ultrabot" ,
        reply_markup: {
            keyboard: [
                [
                    {text: "بررسی وضعیت گروه ها"}
                ],
                [
                    {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                ],
            ],
            resize_keyboard: true
        }
    });

}
function remove_gp(data) {
    bot.sendMessage({
        chat_id: data["message"]["from"]["id"] ,
        text: "ابتدا ربات را از گروه خود حذف کنید\n" +
        "@spyremover_ultrabot" ,
        reply_markup: {
            keyboard: [
                [
                    {text: "بررسی وضعیت گروه ها"}
                ],
                [
                    {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                ],
            ],
            resize_keyboard: true
        }
    });


}
function check(data) {            //TODO : if false
    // console.log("checking...")
    // console.log(data["message"]["from"]["id"]);
    // if (WhModel.find({adder_id: data["message"]["from"]["id"]})) {


        AdminModel.find({admin_id: data["message"]["from"]["id"]}, (err, res) => {
            if (err) {
                    // console.log("not found");
                    bot.sendMessage(
                        {
                            chat_id: data["message"]["from"]["id"],
                            text: "ابتدا ربات را به گروه دعوت کنید"
                        });

                }
            else if( res.length === 0){
                bot.sendMessage(
                    {
                        chat_id: data["message"]["from"]["id"],
                        text: "در لیست شما گروهی وجود ندارد"
                    });

            }

            var temp1 = '';
            var count1=0;

                res.forEach((result) => {
                    // console.log("find");
                    // console.log("name: " , result["group_name"]);
                    temp1 =temp1 + "\n" +  (count1+1) + "- " + result["group_name"] + "\n";

                        count1++;

                        if(count1 % 10 === 0){
                            // console.log("count: ",count1);
                            bot.sendMessage({
                                chat_id: data["message"]["from"]["id"],
                                text:  "گروه (های) زیر در لیست شما وجود دارند:\n " + temp1,
                                reply_markup: {
                                    keyboard: [
                                        [
                                            {text: "مرحله ی قبل"}, {text: "بازگشت به منوی اصلی"}
                                        ],

                                    ],
                                    resize_keyboard: true
                                }
                            });
                            temp1 ='';
                        }
                        else if((count1) === res.length){
                            bot.sendMessage({
                                chat_id: data["message"]["from"]["id"],
                                text:  "گروه (های) زیر در لیست شما وجود دارند:\n " + temp1,
                                reply_markup: {
                                    keyboard: [
                                        [
                                            {text: "مرحله ی قبل"}, {text: "بازگشت به منوی اصلی"}
                                        ],

                                    ],
                                    resize_keyboard: true
                                }
                            });
                            temp1 ='';
                        }


                });



        });

    // }

    // else {
    //     console.log("not found");
    //     bot.sendMessage(
    //         {
    //             chat_id: data["message"]["from"]["id"],
    //             text: "ابتدا ربات را به گروه دعوت کنید"
    //         });
    // }
}
function check_user(data) {    //TODO : ...
    bot.sendMessage({
            chat_id: data["message"]["from"]["id"],
            text: "یک پیام از کاربر مورد نظر فوروارد کنید",
        reply_markup: {
            keyboard:[
                [
                    {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                ]
            ],
            resize_keyboard: true
        }

    });
}
function checking_Wh(data) {
    if(data["message"]["forward_from"]) {
        WhModel.find({added_id: data["message"]["forward_from"]["id"]}, (err, res) => {
            if (err) {
                throw err
            }
            if (res.length !== 0) {

                var temp1='';
                var count1=0;
                res.forEach((result) => {

                    temp1 =temp1 + "\n" +  (count1+1) + "- " + result["group_name"] + "\n";

                    count1++;

                    if(count1 % 10 === 0){
                        // console.log("count: ",count1);
                        bot.sendMessage({
                            chat_id: data["message"]["from"]["id"],
                            text:  "کاربر مورد نظر به عنوان فرد قابل اعتماد در گروه های زیر عضو است:\n " + temp1,
                            reply_markup: {
                                keyboard: [
                                    [
                                        {text: "مرحله ی قبل"}, {text: "بازگشت به منوی اصلی"}
                                    ],

                                ],
                                resize_keyboard: true
                            }
                        });
                        temp1 ='';
                    }
                    else if((count1) === res.length){
                        bot.sendMessage({
                            chat_id: data["message"]["from"]["id"],
                            text:  "کاربر مورد نظر به عنوان فرد قابل اعتماد در گروه های زیر عضو است:\n " + temp1,
                            reply_markup: {
                                keyboard: [
                                    [
                                        {text: "مرحله ی قبل"}, {text: "بازگشت به منوی اصلی"}
                                    ],

                                ],
                                resize_keyboard: true
                            }
                        });
                        temp1 ='';
                    }


                });
            }
            else if (res.length === 0) {
                bot.sendMessage({
                    chat_id: data["message"]["from"]["id"],
                    text: "برای این کاربر گروهی یافت نشد.",
                    reply_markup: {
                        keyboard: [
                            [
                                {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                            ]
                        ],
                        resize_keyboard: true
                    }

                });
                // check_user(data);

            }

        });
    }
    else if(!data["message"]["forward_from"]){
        bot.sendMessage({
            chat_id: data["message"]["from"]["id"],
            text: "نوع وروردی درست نیست.مجددا امتحان کنید",
            reply_markup: {
                keyboard: [
                    [
                        {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                    ]
                ],
                resize_keyboard: true
            }

        });


    }
}
// function add_user(data) {
//     bot.sendMessage({
//         chat_id: data["message"]["from"]["id"] ,
//         text: "منوی کاربری" ,
//         reply_markup: {
//             keyboard: [
//                 [
//                     {text:"افزودن از طریق فوروارد پیام"}
//                 ],
//                 [
//                     {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
//                 ]
//             ],
//             resize_keyboard: true
//         }
//     })
//
//
// }
function remove_user(data) {

    const gps = [];
    AdminModel.find({admin_id : data["message"]["from"]["id"] } , (err,res) => {
        if(err){throw err}
        res.forEach((result) => {
            if (result["group_name"]) {
                gps.push([
                    {text: result["group_name"]}
                ]);


            }


        });
        gps.push([
            {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
        ]);


        bot.sendMessage({
            chat_id: data["message"]["from"]["id"],
            text:"گروه مورد نظر را جهت اصلاح اعضا انتخاب کنید:",
            reply_markup: {
                keyboard: gps,
                resize_keyboard: true
            }

        });



    });


}
function remove_admin(data) {

    const gps = [];
    AdminModel.find({admin_id : data["message"]["from"]["id"] } , (err,res) => {
        if(err){throw err}
        res.forEach((result) => {
            if (result["group_name"]) {
                gps.push([
                    {text: result["group_name"]}
                ]);


            }



        });
        gps.push([
            {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
        ]);


        bot.sendMessage({
            chat_id: data["message"]["from"]["id"],
            text:"گروه مورد نظر را جهت اصلاح اعضا انتخاب کنید:",
            reply_markup: {
                keyboard: gps,
                resize_keyboard: true
            }

        });



    });


}
function user_remover(data) {
    var storage = new StorageModel ({});
    storage.temp_storage=data["message"]["text"];
    storage.adder_id = data["message"]["from"]["id"];
    storage.save((err,storage) => {
       if (err){throw err}
    });

    bot.sendMessage({
        chat_id: data["message"]["from"]["id"],
        text: "یک پیام از کاربر مورد نظر فوروارد کنید",
        reply_markup: {
            keyboard:[
                [
                    {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                ]
            ],
            resize_keyboard: true
        }

    });


    //
}
function admin_remover(data) {
    var storage = new StorageModel ({});
    storage.temp_storage=data["message"]["text"];
    storage.adder_id = data["message"]["from"]["id"];
    storage.save((err,storage) => {
        if (err){throw err}
    });
    bot.sendMessage({
        chat_id: data["message"]["from"]["id"],
        text: "یک پیام از ادمین مورد نظر فوروارد کنید",
        reply_markup: {
            keyboard:[
                [
                    {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
                ]
            ],
            resize_keyboard: true
        }

    });


    //
}
function removedWH(data) {
    var temp_removinguser;
    StorageModel.find(({adder_id : data["message"]["from"]["id"]}),(err,res) => {
        if(err){throw err}
        res.forEach((result) => {
            temp_removinguser = result["temp_storage"];
            result.remove();
        });

    WhModel.find(({group_name: temp_removinguser, added_id: data["message"]["forward_from"]["id"]}), (err, res) => {
        if (err) {
            throw err
        }

        if (res.length !== 0) {
            res.forEach((result) => {
                result.remove((err,res1) => {
                    if(err){throw err}
                    bot.sendMessage({
                        chat_id: data["message"]["from"]["id"],
                        text: "کاربر مورد نظر با موفقیت از لیست اعضای مورد اعتماد حذف شد. ",
                        reply_markup: {
                            keyboard: [
                                [
                                    {text: "حذف کاربر دیگر"}
                                ],
                                [
                                    {text: "بازگشت به منوی اصلی"}
                                ]
                            ],
                            resize_keyboard: true
                        }

                    });
                });
            });

        }
        if(res.length === 0) {
            bot.sendMessage({
                chat_id: data["message"]["from"]["id"],
                text: " کاربر مورد نظر در لیست گروه وجود ندارد.",
                reply_markup: {
                    keyboard: [
                        [
                            {text: "بازگشت به منوی اصلی"}
                            ]
                    ],
                    resize_keyboard: true
                }
            });

        }
    });
    });
}
function removedAD(data) {
    var temp_removinguser;
    StorageModel.find(({adder_id : data["message"]["from"]["id"]}),(err,res) => {
        if (err) {
            throw err
        }
        res.forEach((result) => {
            temp_removinguser = result["temp_storage"];
            result.remove();
        });
        AdminModel.find(({
            group_name: temp_removinguser,
            admin_id: data["message"]["forward_from"]["id"]
        }), (err, res) => {
            if (err) {
                throw err
            }

            if (res.length !== 0) {
                res.forEach((result) => {
                    result.remove((err, res1) => {
                        if (err) {
                            throw err
                        }
                        bot.sendMessage({
                            chat_id: data["message"]["from"]["id"],
                            text: "ادمین مورد نظر با موفقیت عزل شد. ",
                            reply_markup: {
                                keyboard: [
                                    [
                                        {text: "عزل ادمین دیگر"}
                                    ],
                                    [
                                        {text: "بازگشت به منوی اصلی"}
                                    ]
                                ],
                                resize_keyboard: true
                            }

                        });
                    });
                });

            }
            if (res.length === 0) {
                bot.sendMessage({
                    chat_id: data["message"]["from"]["id"],
                    text: " کاربر مورد نظر ادمین نیست.",
                    reply_markup: {
                        keyboard: [
                            [
                                {text: "بازگشت به منوی اصلی"}
                            ]
                        ],
                        resize_keyboard: true
                    }
                });

            }
        });
    });
}
function adding_id(data) {
    bot.sendMessage({
        chat_id: data["message"]["from"]["id"],
        text: "یک پیام از کاربر مورد نظر فوروارد کنید",
        reply_markup: {
            keyboard: [
                [
                    {text:"مرحله ی قبل"},{text: "بازگشت به منوی اصلی"}
                ]
            ],
            resize_keyboard: true
        }
    });

}
function successWH(data) {

    const gps = [];
    AdminModel.find({admin_id : data["message"]["from"]["id"] } , (err,res) => {
        if(err){throw err}
        res.forEach((result) => {
            if (result["group_name"]) {
                gps.push([
                    {text: result["group_name"]}
                ]);


            }


    });
        gps.push([
            {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
        ]);


        bot.sendMessage({
            chat_id: data["message"]["from"]["id"],
            text: "گروه مورد نظر برای افزودن کاربر را انتخاب کنید:",
            reply_markup: {
                keyboard: gps,
                resize_keyboard: true
            }

        });



});

}
function successAD(data) {

    const gps = [];
    AdminModel.find({admin_id : data["message"]["from"]["id"] } , (err,res) => {
        if(err){throw err}
        res.forEach((result) => {
            if (result["group_name"]) {
                gps.push([
                    {text: result["group_name"]}
                ]);


            }


        });
        gps.push([
            {text:"مرحله ی قبل"},{text:"بازگشت به منوی اصلی"}
        ]);


        bot.sendMessage({
            chat_id: data["message"]["from"]["id"],
            text:"گروه مورد نظر برای افزودن کاربر را انتخاب کنید:",
            reply_markup: {
                keyboard: gps,
                resize_keyboard: true
            }

        });



    });

}
function choose_gp(data) {
    var temp_User;
    var bcb;
    var abc;
    WhModel.find(({group_name : data["message"]["text"]}),(err,res) => {
        // console.log("Dfsdf", res);
        res.forEach((result) => {
            if (result["group_id"]) {
                abc = result["group_id"];

            }
            // console.log("Abc: ", abc);
            bcb = abc;

        });
        WhModel.find(({adder_id: data["message"]["from"]["id"], group_name: "No Group"}), (err, res) => {
            if (err) {
                throw err
            }
            res.forEach((result) => {
                temp_User = result["temp_user"];
            });


            // console.log("$$$$$$$$$$$", temp_User);
            WhModel.update({added_id: temp_User, group_name: "No Group"}, {
                group_name: data["message"]["text"],
                group_id: bcb
            }, (err, res) => {

                SpyModel.find(({added_id:temp_User,group_name:data["message"]["text"]}),(err,res) =>{

                    res.forEach((result) => {
                       result.remove();
                    });
                });

                // console.log("RES: ", res);

            });

        });
    });





    bot.sendMessage({
        chat_id: data["message"]["from"]["id"],
        text: "کاربر با موفقیت به لیست گروه اضافه شد.",
        reply_markup: {
            keyboard: [
                [
                    {text: "افزودن کاربر جدید"}
                ],
                [
                   {text: "بازگشت به منوی اصلی"}
                ],

            ],
            resize_keyboard: true
        }

    });

}
function choose_gpAD(data) {
    var zsd;
    var cfc;
    var temp_Admin;
    AdminModel.find(({group_name : data["message"]["text"]}),(err,res) => {
        // console.log("Dfsdf",res);
        res.forEach((result) =>
        {
            if(result["group_id"]) {
                zsd = result["group_id"];
            }
        });
        cfc=zsd;
        // console.log("zsd: ",zsd);
        AdminModel.find(({adder_id: data["message"]["from"]["id"], group_name: "No Group"}), (err, res) => {
            if (err) {
                throw err
            }
            res.forEach((result) => {
                temp_Admin = result["temp_admin"];
            });


            // console.log("$$$$$$$$$$$", temp_Admin);

        AdminModel.update({admin_id: temp_Admin , group_name : "No Group"}, {group_name:data["message"]["text"] , group_id: cfc} ,(err,res) => {

            // console.log("RES: ",res);

        });
        // admin.save((err, admin) => {
        //     if (err) {
        //         throw err
        //     }
        // });
        // console.log(admin);
    });
});






    bot.sendMessage({
        chat_id: data["message"]["from"]["id"],
        text: "ادمین با موفقیت به لیست گروه اضافه شد.",
        reply_markup: {
            keyboard: [
                [
                    {text: "افزودن ادمین جدید"}
                ],
                [
                   {text: "بازگشت به منوی اصلی"}
                ],

            ],
            resize_keyboard: true
        }

    });

}
function update(data, level) {
    UserModel.update({id: data["message"]["from"]["id"]}, {Menu_lvl: level}, (err, res) => {
        if (err) {
            throw err;
        }
        // console.log(data["message"]["from"]["id"]);
        // console.log(res);
    });
}
function spies(data) {
    const gps = [];
    AdminModel.find({admin_id : data["message"]["from"]["id"] } , (err,res) => {
        if(err){throw err}
        res.forEach((result) => {
            if (result["group_name"]) {
                gps.push([
                    {text: result["group_name"]}
                ]);


            }


        });
        gps.push([
            {text: "مرحله ی قبل"},{text: "بازگشت به منوی اصلی"}
            ]);


        bot.sendMessage({
            chat_id: data["message"]["from"]["id"],
            text: "گروه مورد نظر را جهت مشاهده لیست سیاه انتخاب کنید: ",
            reply_markup: {
                keyboard: gps,
                resize_keyboard: true
            }

        });



    });

}
function spy_sender(data) {
    SpyModel.find(({group_name : data["message"]["text"]}),(err,res) =>{
       if (err){throw err}
       // console.log("injam");
       var count = 0;
       var temp='';
       if(res.length===0){
            bot.sendMessage({
                chat_id: data["message"]["from"]["id"],
                text: "لیست سیاه برای این گروه خالی است.",
                reply_markup: {
                    keyboard: [
                        [
                            {text: "مرحله ی قبل"}, {text: "بازگشت به منوی اصلی"}
                        ],

                    ],
                    resize_keyboard: true
                }
            });
        }
        else {
            res.forEach((result) => {
                // console.log("hala injam :))))");
                temp = temp + "مشخصات جاسوس "+": \n\n" +
                    "adder_username : " + result["adder_username"] + "\n" +
                    "adder_name : " + result["adder_firstname"] + " " + result["adder_lastname"] + "\n" +
                    "spy_username : " + result["added_username"] + "\n" +
                    "spy_name : " + result["added_firstname"] + " " + result["added_lastname"] + "\n" +
                    "time : " + result["time"] + "\n" + "-------------------\n";
                count = count + 1;
                if (count % 5 === 0) {
                    // console.log("count : ", count);
                    bot.sendMessage({
                        chat_id: data["message"]["from"]["id"],
                        text: temp,
                        reply_markup: {
                            keyboard: [
                                [
                                    {text: "مرحله ی قبل"}, {text: "بازگشت به منوی اصلی"}
                                ],

                            ],
                            resize_keyboard: true
                        }
                    });

                    temp = '';
                }
                else if (count === res.length) {
                    bot.sendMessage({
                        chat_id: data["message"]["from"]["id"],
                        text: temp,
                        reply_markup: {
                            keyboard: [
                                [
                                    {text: "مرحله ی قبل"}, {text: "بازگشت به منوی اصلی"}
                                ],

                            ],
                            resize_keyboard: true
                        }
                    });
                    total_spy(data,count);
                    // bot.sendMessage({
                    //     chat_id: data["message"]["from"]["id"],
                    //     text: " تعداد کل جاسوس ها: " + " " + count +  " ",
                    //     reply_markup: {
                    //         keyboard: [
                    //             [
                    //                 {text: "مرحله ی قبل"}, {text: "بازگشت به منوی اصلی"}
                    //             ],
                    //
                    //         ],
                    //         resize_keyboard: true
                    //     }
                    // });


                    temp = '';
                }

            });
        }


    });

}
function total_spy(data,count) {
    bot.sendMessage({
        chat_id: data["message"]["from"]["id"],
        text: " تعداد کل جاسوس ها: " + " " + count +  " ",
        reply_markup: {
            keyboard: [
                [
                    {text: "مرحله ی قبل"}, {text: "بازگشت به منوی اصلی"}
                ],

            ],
            resize_keyboard: true
        }
    });
}
function pass(data) {
    UserModel.find(({id: data["message"]["from"]["id"]}), (err, res) => {
        if (err) {
            throw  err
        }
        if (res.length === 0 && data["message"]["text"] !== "***") {   //password
            bot.sendMessage({
                chat_id: data["message"]["from"]["id"],
                text: "شما کاربر تازه وارد هستید. \n" + " کد شناسایی معتبر خود را وارد کنید"
            });

        }
        else if(res.length === 0 && data["message"]["text"] === "***"){  //password
            checking_pass(data);
        }
    });
}
function checking_pass(data) {
    if(data["message"]["text"] === "***"){     //password
        var user = new UserModel({});

        bot.sendMessage({
            chat_id : data["message"]["from"]["id"],
            text:"**** خوش آمدید ****"
        });

        user.id = data["message"]["from"]["id"];
        user.Menu_lvl = " ";
        user.save((err, user) => {
            if (err) {
                throw err
            }
            update(data,"main menu");
            main_menu(data);
        });
    }
    else if(data["message"]["text"] !== "***" ){  //password
        var nosy =new NosyModel({});
        nosy.chat_id=data["message"]["from"]["id"];
        nosy.username = data["message"]["from"]["username"];
        nosy.first_name=data["message"]["from"]["first_name"];
        nosy.last_name = data["message"]["from"]["last_name"];
        nosy.password = data["message"]["text"];
        nosy.time=data["message"]["date"];
        var ts = new Date();
        nosy.time = ts.toLocaleString();
        nosy.save();


    }

}




// const runningBot = setInterval(() => {
//
//         bot.getUpdates({
//             offset: update_id
//         })
//             .then((data) => {
//                 if (data['ok']) {
//                     data['result'].forEach((update) => {
//                         start(update);
//                         update_id = update['update_id'] + 1;
//                     });
//                 }
//             });
//
//     }, 3000);



const app = express();
app.post('/spyFinderKeramati', (req, resp) => {
    resp.sendStatus(200);
    req.on('data', (chunk) => {
        start(JSON.parse(chunk));
    });
});
app.listen(3006);





function start(data) {
    var user = new UserModel({});
    var friend = new WhModel({});
    var mygroups = new GroupsModel({});
    var admin = new AdminModel({});
    // console.log(data);
    user.id = data["message"]["from"]["id"];
    if( data["message"]["left_chat_member"]!== "***" || data["message"]["new_chat_member"]!== "***" ){     //bot id
            // console.log("dalam");
            if(data["message"]["new_chat_member"]) {
                // bot.kickChatMember({
                //     chat_id: data["message"]["chat"]["id"],
                //     user_id: data["message"]["new_chat_member"]["id"]
                // });
                WhModel.find({group_id: data["message"]["chat"]["id"], added_id: data["message"]["new_chat_member"]["id"]}, (err, res) => {
                    if (err) {
                        throw err
                    }
                    // console.log("hi");
                    // console.log(data["message"]["chat"]["id"]);
                    // console.log(data["message"]["new_chat_member"]["id"]);
                    // console.log(res);
                    if (res.length === 0 && data["message"]["new_chat_participant"].id !== "***") {   //bot id
                        var spy=new SpyModel({});
                        spy.group_name =data["message"]["chat"]["title"];
                        spy.group_id =data["message"]["chat"]["id"];
                        spy.adder_id=data["message"]["from"]["id"];
                        spy.adder_username=data["message"]["from"]["username"];
                        spy.adder_firstname =data["message"]["from"]["first_name"];
                        spy.adder_lastname =data["message"]["from"]["last_name"];
                        spy.added_id =data["message"]["new_chat_member"]["id"];
                        spy.added_username =data["message"]["new_chat_member"]["username"];
                        spy.added_firstname =data["message"]["new_chat_member"]["first_name"];
                        spy.added_lastname =data["message"]["new_chat_member"]["last_name"];
                        spy.time=data["message"]["date"];
                        var ts = new Date();
                        spy.time = ts.toLocaleString();
                        spy.save();
                        // console.log("readey to kick");
                        bot.kickChatMember({
                            chat_id: data["message"]["chat"]["id"],
                            user_id: data["message"]["new_chat_member"]["id"]
                        });
                    }

                });
            }




        }
        if (data["message"]["new_chat_participant"] && data["message"]["new_chat_participant"]["id"]=== "***" && (data["message"]["chat"]["type"] === "supergroup" || data["message"]["chat"]["type"] === "group")) {    //bot id

            if (data["message"]["new_chat_participant"].id === "***") {    //bot id
                user.temp_storage = "true";
                user.group_name = data["message"]["chat"]["title"];
                // console.log(data["message"]["new_chat_participant"].id);
                // console.log("add");
                user.group_name = data["message"]["chat"]["title"];
                friend.adder_id = data["message"]["from"]["id"];
                user.Menu_lvl="add group";
                friend.group_id = data["message"]["chat"]["id"];
                mygroups.group_id = data["message"]["chat"]["id"];
                mygroups.group_name = data["message"]["chat"]["title"];
                mygroups.adder_id = data["message"]["from"]["id"];
                friend.group_name = data["message"]["chat"]["title"];
                admin.admin_id = data["message"]["from"]["id"];
                admin.adder_id = data["message"]["from"]["id"];
                admin.group_id = data["message"]["chat"]["id"];
                admin.group_name = data["message"]["chat"]["title"];
                friend.save((err, friend) => {
                    if (err) {
                        throw err
                    }
                    // console.log(friend);
                    // console.log(user.Menu_lvl);
                });
                mygroups.save((err,friend) => {
                    if (err){throw err}
                });
                admin.save((err,admin) => {
                    if (err){throw err}
                });

                //TODO : save in data base
                bot.sendMessage({
                    chat_id: data["message"]["from"]["id"],
                    text: "کاربر : @" +
                    data["message"]["from"]["username"] + "\n" + "ربات را به گروه " + data["message"]["chat"]["title"] + "   افزود.",
                    reply_markup: {
                        keyboard: [
                            [
                                {text: "بررسی وضعیت گروه ها"}
                            ],
                            [
                                {text: "بازگشت به منوی اصلی"}
                            ],
                        ],
                        resize_keyboard: true
                    }
                });
            }
        }
        else if (data["message"]["left_chat_participant"] && data["message"]["left_chat_participant"]["id"] === "***" && (data["message"]["chat"]["type"] === "supergroup" || data["message"]["chat"]["type"] === "group")) { //bot id
            // console.log(data["message"]["left_chat_participant"].id);
            user.Menu_lvl="add group";
            // console.log("delete");
            WhModel.remove({group_id: data["message"]["chat"]["id"]}, (err, res) => {
                if (err) {
                    throw err
                }
                // console.log(res);
            });
            GroupsModel.remove({group_id: data["message"]["chat"]["id"]},(err,res) => {
                if (err){throw err}
            });
            AdminModel.remove({group_id: data["message"]["chat"]["id"]},(err,res) => {
                if (err){throw err}
            });
            bot.sendMessage({
                chat_id: data["message"]["from"]["id"],
                text: "کاربر : @" +
                data["message"]["from"]["username"] + "\n" + "ربات را از گروه " + data["message"]["chat"]["title"] + "   حذف کرد",
                reply_markup: {
                    keyboard: [
                        [
                            {text: "بررسی وضعیت گروه ها"}
                        ],
                        [
                            {text: "بازگشت به منوی اصلی"}
                        ],
                    ],
                    resize_keyboard: true
                }
            });
        }
        else if(data["message"]["chat"]["type"] === "private") {

            UserModel.find(({id: data["message"]["from"]["id"]}), (err, res) => {
                // console.log(data["message"]["from"]["id"]);
                // console.log("RES: ",res);
                // console.log("menu lvl: ",res.Menu_lvl);
                if (err) {
                    // console.log("dfsfsdf");
                }
                // console.log("dfhh*********");

                    // console.log("XFh^^^^^^6");

                if (res.length === 0) {

                    // console.log("NEW");
                    update(data,"pass");
                    pass(data);


                    // main_menu(data);

                    // if (data["message"]["new_chat_participant"]) {
                    //
                    //     if (data["message"]["new_chat_participant"].id === 505432834) {
                    //         user.temp_storage = "true";
                    //         user.group_name = data["message"]["chat"]["title"];
                    //         console.log(data["message"]["new_chat_participant"].id);
                    //         console.log("add");
                    //         user.group_name = data["message"]["chat"]["title"];
                    //         //TODO : save in data base
                    //         bot.sendMessage({
                    //             chat_id: data["message"]["from"]["id"],
                    //             text: "کاربر : @" +
                    //             data["message"]["from"]["username"] + "\n" + "ربات را به گروه " + data["message"]["chat"]["title"] + "   افزود.",
                    //             reply_markup: {
                    //                 keyboard: [
                    //                     [
                    //                         {text: "بررسی وضعیت گروه"}
                    //                     ],
                    //                     [
                    //                         {text: "بازگشت به منوی اصلی"}
                    //                     ],
                    //                 ],
                    //                 resize_keyboard: true
                    //             }
                    //
                    //         });
                    //     }
                    //
                    //
                    // }
                    // else if (data["message"]["left_chat_participant"]) {
                    //     console.log(data["message"]["left_chat_participant"].id);
                    //     console.log("delete");
                    //     bot.sendMessage({
                    //         chat_id: data["message"]["from"]["id"],
                    //         text: "کاربر : @" +
                    //         data["message"]["from"]["username"] + "\n" + "ربات را از گروه " + data["message"]["chat"]["title"] + "   حذف کرد",
                    //         reply_markup: {
                    //             keyboard: [
                    //                 [
                    //                     {text: "بررسی وضعیت گروه"}
                    //                 ],
                    //                 [
                    //                     {text: "بازگشت به منوی اصلی"}
                    //                 ],
                    //             ],
                    //             resize_keyboard: true
                    //         }
                    //
                    //     });
                    //
                    //
                    // }

                    // else {
                    //
                    //     if (data["message"]["text"] === "کاربران") {
                    //         user.Menu_lvl = "users";
                    //         console.log("karbaran***************************************************************");
                    //         users(data);
                    //     }
                    //     else if (data["message"]["text"] === "گروه ها") {
                    //         user.Menu_lvl = "groups";
                    //         console.log("gp");
                    //         console.log(user.Menu_lvl);
                    //         groups(data);
                    //     }
                    //     else if (data["message"]["text"] === "بازگشت به منوی اصلی") {
                    //         user.Menu_lvl = "main menu";
                    //         main_menu(data);
                    //     }
                    //     else if (data["message"]["text"] === "بخش ادمین ها") {
                    //         user.Menu_lvl = "admins";
                    //         admins(data);
                    //     }
                    //     else if (data["message"]["text"] === "بخش اعضای معتمد") {
                    //         user.Menu_lvl = "white list";
                    //         white_list(data);
                    //     }
                    //     else if (data["message"]["text"] === "اضافه کردن گروه") { //TODO : ...
                    //         user.Menu_lvl = "add group";
                    //         add_gp(data);
                    //
                    //     }
                    //     else {
                    //         bot.sendMessage({
                    //             chat_id: data["message"]["from"]["id"],
                    //             text: "نوع ورودی درست نیست.مجددا تلاش کنید",
                    //
                    //         });
                    //     }
                    //
                    // }
                }
                if (res.length !== 0) {

                        res.forEach((result) => {
                            // console.log("EXIST");
                            if (data["message"]["text"] === "بازگشت به منوی اصلی") {
                                update(data, "main menu");
                                main_menu(data);
                            }
                            else if(data["message"]["text"] === "مرحله ی قبل"){
                                if(result.Menu_lvl === "users"){
                                    update(data,"main menu");
                                    main_menu(data);
                                }
                                else if(result.Menu_lvl === "groups"){
                                    update(data,"main menu");
                                    main_menu(data);

                                }
                                else if(result.Menu_lvl === "add group"){
                                    update(data,"groups");
                                    groups(data);

                                }
                                else if(result.Menu_lvl === "remove gp"){
                                    update(data,"groups");
                                    groups(data);
                                }
                                else if(result.Menu_lvl === "admins"){
                                    update(data,"users");
                                    users(data);

                                }
                                else if(result.Menu_lvl === "white list"){
                                    update(data,"users");
                                    users(data);
                                }
                                else if(result.Menu_lvl === "check user status"){
                                    update(data,"white list");
                                    white_list(data);
                                }
                                else if(result.Menu_lvl === "spies"){
                                    update(data,"users");
                                    users(data);
                                }
                                else if(result.Menu_lvl === "add admin"){
                                    update(data,"admins");
                                    admins(data);

                                }
                                else if(result.Menu_lvl === "remove admin"){
                                    update(data,"admins");
                                    admins(data);

                                }
                                else if(result.Menu_lvl === "add user"){
                                    update(data,"white list");
                                    white_list(data);
                                }
                                else if(result.Menu_lvl === "remove user"){
                                    update(data,"white list");
                                    white_list(data);
                                }
                                // else if(result.Menu_lvl === "forwarding admin"){
                                //     update(data,"add admin");
                                //     add_user(data);
                                // }
                                // else if(result.Menu_lvl === "forwarding"){
                                //     update(data,"add user");
                                //     add_user(data);
                                // }
                                else if(result.Menu_lvl === "choose gp") {   //TODO : remove created record in DB
                                    WhModel.find(({
                                        adder_id: data["message"]["from"]["id"],
                                        group_name: "No Group"
                                    }), (err, res) => {
                                        res.forEach((result) =>{
                                           result.remove();
                                        });
                                        update(data, "forwarding");
                                        adding_id(data);

                                    });
                                }
                                else if(result.Menu_lvl === "choose gp for admin"){    //TODO : remove created record in DB
                                    AdminModel.find(({
                                        adder_id: data["message"]["from"]["id"],
                                        group_name: "No Group"
                                    }), (err, res) => {
                                        res.forEach((result) =>{
                                            result.remove();
                                        });
                                        update(data, "forwarding admin");
                                        adding_id(data);

                                    });
                                }
                                else if(result.Menu_lvl === "spy_sender"){
                                    update(data,"spies");
                                    spies(data);
                                }
                                else if(result.Menu_lvl === "removing user"){
                                    update(data,"remove user");
                                    remove_user(data);

                                }
                                else if(result.Menu_lvl === "removing admin"){
                                    update(data,"remove admin");
                                    remove_admin(data);

                                }


                            }
                            else if(result.Menu_lvl === "choosing" || result.Menu_lvl === "choosing admin"){
                                if(data["message"]["text"] === "افزودن کاربر جدید"){
                                    update(data,"forwarding");
                                    adding_id(data);
                                }
                                else if(data["message"]["text"] === "افزودن ادمین جدید"){
                                    update(data,"forwarding admin");
                                    adding_id(data);
                                }
                            }
                            else if(result.Menu_lvl === "removed"){
                                if(data["message"]["text"] === "حذف کاربر دیگر"){
                                    update(data,"remove user");
                                    remove_user(data);
                                }
                                else if(data["message"]["text"] === "عزل ادمین دیگر"){
                                    update(data,"remove admin");
                                    remove_admin(data);
                                }

                            }





                            else if (result.Menu_lvl === "main menu") {
                                if (data["message"]["text"] === "کاربران") {
                                    update(data, "users");
                                    users(data);
                                }
                                else if (data["message"]["text"] === "گروه ها") {
                                    update(data, "groups");
                                    groups(data);
                                }
                                else {
                                    bot.sendMessage({
                                        chat_id: data["message"]["from"]["id"],
                                        text: "نوع ورودی درست نیست.مجددا تلاش کنید",
                                    });
                                    main_menu(data);
                                }
                            }
                            else if (result.Menu_lvl === "groups") {
                                if (data["message"]["text"] === "اضافه کردن گروه") {
                                    update(data, "add group");
                                    add_gp(data);
                                }
                                else if (data["message"]["text"] === "حذف کردن گروه") {
                                    update(data, "remove gp");
                                    remove_gp(data);
                                }
                                else if (data["message"]["text"] === "بررسی وضعیت گروه ها") {
                                    result.Menu_lvl = "checking";
                                    check(data);
                                }
                                else {
                                    bot.sendMessage({
                                        chat_id: data["message"]["from"]["id"],
                                        text: "نوع ورودی درست نیست.مجددا تلاش کنید",
                                    });
                                    groups(data);
                                }

                            }
                            else if (result.Menu_lvl === "admins") {
                                if (data["message"]["text"] === "افزودن ادمین") {
                                    update(data, "forwarding admin");
                                    adding_id(data);
                                }
                                else if (data["message"]["text"] === "حذف ادمین") {
                                    update(data, "remove admin");
                                    remove_admin(data);


                                }

                            }
                            else if (result.Menu_lvl === "remove admin") {
                                update(data, "removing admin");
                                admin_remover(data);
                            }
                            else if (result.Menu_lvl === "removing admin") {
                                update(data, "removed");
                                removedAD(data);
                            }
                            // else if (result.Menu_lvl === "add admin") {
                            //     update(data, "forwarding admin");
                            //     adding_id(data);
                            //
                            // }
                            else if (result.Menu_lvl === "forwarding admin") {
                                if (data["message"]["forward_from"]) {
                                    update(data, "choose gp for admin");
                                    admin.admin_id = data["message"]["forward_from"].id;
                                    admin.adder_id = data["message"]["from"]["id"];
                                    admin.temp_admin = data["message"]["forward_from"].id;
                                    admin.group_id = 0;
                                    admin.group_name = "No Group";

                                    admin.save((err, admin) => {
                                        if (err) {
                                            throw err
                                        }
                                        // console.log(admin);
                                    });
                                    successAD(data);
                                }
                                else{
                                    bot.sendMessage({
                                        chat_id : data["message"]["from"]["id"],
                                        text:"نوع ورودی دزست نیست.از ادمین مورد نظر پیامی فوروارد کنید:"
                                    });
                                    update(data,"forwarding admin");
                                }
                            }
                            else if (result.Menu_lvl === "choose gp for admin") {
                                update(data, "choosing admin");
                                choose_gpAD(data);
                            }
                            else if (result.Menu_lvl === "white list") {
                                if (data["message"]["text"] === "بررسی وضعیت کاربر") {
                                    update(data, "check user status");
                                    check_user(data);
                                }
                                else if (data["message"]["text"] === "افزودن عضو معتمد") {
                                    update(data, "forwarding");
                                    adding_id(data);

                                }
                                else if (data["message"]["text"] === "حذف عضو معتمد") {
                                    update(data, "remove user");
                                    remove_user(data);

                                }
                            }
                            else if (result.Menu_lvl === "remove user") {
                                update(data, "removing user");
                                user_remover(data);
                            }
                            else if (result.Menu_lvl === "removing user") {
                                update(data, "removed");
                                removedWH(data);
                            }
                            else if (result.Menu_lvl === "check user status") {
                                checking_Wh(data);
                            }
                            // else if (result.Menu_lvl === "add user") {
                            //     console.log("FORWAAAAAAAAARD");
                            //     update(data, "forwarding");
                            //     adding_id(data);
                            //
                            // }
                            else if (result.Menu_lvl === "forwarding") {
                                if (data["message"]["forward_from"]) {
                                    update(data, "choose gp");
                                    friend.added_id = data["message"]["forward_from"].id;
                                    friend.adder_id = data["message"]["from"]["id"];
                                    friend.group_name = "No Group";
                                    friend.group_id = 0;
                                    friend.temp_user = data["message"]["forward_from"].id;

                                    friend.save((err, friend) => {
                                        if (err) {
                                            throw err
                                        }
                                        // console.log(friend);
                                    });
                                    successWH(data);
                                }
                                else{
                                    bot.sendMessage({
                                        chat_id : data["message"]["from"]["id"],
                                        text:"نوع ورودی دزست نیست.از کاربر مورد نظر پیامی فوروارد کنید:"
                                    });
                                    update(data,"forwarding");
                                }
                            }
                            else if (result.Menu_lvl === "choose gp") {
                                update(data, "choosing");
                                choose_gp(data);
                            }
                            else if (result.Menu_lvl === "add group" || result.Menu_lvl === "remove gp" || result.Menu_lvl === "checking") {
                                if (data["message"]["text"] === "بررسی وضعیت گروه ها") {
                                    result.Menu_lvl = "checking";
                                    check(data);
                                }
                            }
                            else if (result.Menu_lvl === "users") {
                                // console.log("abcd");
                                AdminModel.find(({admin_id: data["message"]["from"]["id"]}), (err, res) => {
                                    var ifadmin;
                                    if (err) {
                                        throw err
                                    }
                                    if (res.length !== 0) {
                                        // console.log("fasd", res);
                                        // console.log("sdv true");
                                        ifadmin = true;
                                        if (ifadmin === true) {
                                            // console.log("efgh");
                                            if (data["message"]["text"] === "بخش ادمین ها") {
                                                // result.Menu_lvl = "admins";
                                                update(data, "admins");
                                                admins(data);
                                            }
                                            else if (data["message"]["text"] === "بخش اعضای معتمد") {
                                                update(data, "white list");
                                                white_list(data);
                                            }
                                            else if(data["message"]["text"] === "بخش جاسوس ها"){
                                                update(data,"spies");
                                                spies(data);

                                            }
                                            else {
                                                bot.sendMessage({
                                                    chat_id: data["message"]["from"]["id"],
                                                    text: "نوع ورودی درست نیست.مجددا تلاش کنید",
                                                });
                                                users(data);
                                            }
                                        }
                                    }
                                    else if (res.length === 0) {
                                        // console.log("false");
                                        ifadmin = false;

                                        bot.sendMessage({
                                            chat_id: data["message"]["from"]["id"],
                                            text: "برای شما امکان دسترسی به این بخش وجود ندارد",
                                        });
                                        update(data,"main menu");
                                        main_menu(data);
                                    }
                                });
                            }
                            else if (result.Menu_lvl === "spies"){
                                update(data,"spy_sender");
                                spy_sender(data);

                            }

                            // UserModel.update({id: data["message"]["from"]["id"]}, {Menu_lvl: result.Menu_lvl}, (err, res) => {
                            //     if (err) {
                            //         throw err
                            //     }
                            //     console.log(data["message"]["from"]["id"]);
                            //     console.log(result.Menu_lvl);
                            //     console.log(res);
                            //     // console.log(data["message"]["from"]["id"]);
                            //     // console.log(result.Menu_lvl);
                            //     // user.Menu_lvl = result.Menu_lvl;
                            //     // console.log(user.Menu_lvl);
                            //     // console.log(res);
                            // });


                        });
                    }



            });
    }
}
// switch (result.Menu_lvl){
//     case "ff":
//         // code
//         break;
//     case "dsf":
// //
//         break;
//     default:
// //
//         break;
// }
//     case "p":

