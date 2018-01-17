// by zhangxinxu 2010-06-17 welcome to visit my personal website http://www.zhangxinxu.com/
// mailAutoComplete.js v1.0 ���������Զ���ʾ
// 2010-06-18 v2.0 ʹ��CSS class�����CSS����ͬʱ��ǿ����ɶ���
// 2010-06-18 v2.1 �������Ӧ�����
// 2010-06-18 v2.2 �޸����Ԫ��ͬʱ���ô˷�����һЩbug
// 2010-06-30 �޸��Ѻ��������ı���
// 2010-06-30 �޸����Ļس�����Ϊ�յ�����
// 2010-08-17 v3.0 ��д�ʼ���ʾ�ĺ��ķ����������ʾ����
// 2010-09-01 �޸�Firefox�µ���б��޷�ȡֵ������
// 2010-09-03 �����ʾ���������Լ�������ɫ�仯
(function ($) {
    $.fn.mailAutoComplete = function (options) {
        var defaults = {
            boxClass: "mailListBox", //�ⲿbox��ʽ
            listClass: "mailListDefault", //Ĭ�ϵ��б���ʽ
            focusClass: "mailListFocus", //�б�ѡ��ʽ��
            markCalss: "mailListHlignt", //������ʽ
            zIndex: 999,
            autoClass: true, //�Ƿ�ʹ�ò���Դ�class��ʽ
            mailArr: ["qq.com", "gmail.com", "126.com", "163.com", "hotmail.com", "yahoo.com", "yahoo.com.cn", "live.com", "sohu.com", "sina.com"], //�ʼ�����
            textHint: false, //������ʾ���Զ���ʾ������
            hintText: "",
            focusColor: "#333",
            blurColor: "#999"
        };
        var settings = $.extend({}, defaults, options || {});

        //ҳ��װ��CSS��ʽ
        if (settings.autoClass && $("#mailListAppendCss").size() === 0) {
            $('<style id="mailListAppendCss" type="text/css">.mailListBox{border:1px solid #369; background:#fff; font:12px/20px Arial;}.mailListDefault{padding:0 5px;cursor:pointer;white-space:nowrap;}.mailListFocus{padding:0 5px;cursor:pointer;white-space:nowrap;background:#369;color:white;}.mailListHlignt{color:red;}.mailListFocus .mailListHlignt{color:#fff;}</style>').appendTo($("head"));
        }
        var cb = settings.boxClass, cl = settings.listClass, cf = settings.focusClass, cm = settings.markCalss; //�����class����
        var z = settings.zIndex, newArr = mailArr = settings.mailArr, hint = settings.textHint, text = settings.hintText, fc = settings.focusColor, bc = settings.blurColor;
        //�����ʼ��ڲ��б�����
        $.createHtml = function (str, arr, cur) {            
            var mailHtml = "";
            if ($.isArray(arr)) {
                $.each(arr, function (i, n) {
                    if (i === cur) {
                        mailHtml += '<div class="mailHover ' + cf + '" id="mailList_' + i + '"><span class="' + cm + '">' + str + '</span>@' + arr[i] + '</div>';
                    } else {
                        mailHtml += '<div class="mailHover ' + cl + '" id="mailList_' + i + '"><span class="' + cm + '">' + str + '</span>@' + arr[i] + '</div>';
                    }
                });
            }
            return mailHtml;
        };
        //һЩȫ�ֱ���
        var index = -1, s;
        $(this).each(function () {
            var that = $(this), i = $(".justForJs").size();
            if (i > 0) { //ֻ��һ���ı���
                return;
            }
            var w = that.outerWidth(), h = that.outerHeight(); //��ȡ��ǰ���󣨼��ı��򣩵Ŀ��
            //��ʽ�ĳ�ʼ��
            that.wrap('<span style="display:inline-block;position:relative;text-indent:0px;"></span>')
				.before('<div id="mailListBox_' + i + '" class="justForJs ' + cb + '" style="min-width:' + w + 'px;_width:' + w + 'px;position:absolute;left:-6000px;top:' + h + 'px;z-index:' + z + ';"></div>');
            var x = $("#mailListBox_" + i), liveValue; //�б�����
            that.focus(function () {
                //����ǩ�Ĳ㼶
                $(this).css("color", fc).parent().css("z-index", z);
                //��ʾ���ֵ���ʾ������
                if (hint && text) {
                    var focus_v = $.trim($(this).val());
                    if (focus_v === text) {
                        $(this).val("");
                    }
                }
                //�����¼�
                $(this).keyup(function (e) {
                    that.parent().parent().find('.phholder')[this.value === '' ? 'show' : 'hide']();
                    s = v = $.trim($(this).val());
                    if (/@/.test(v)) {
                        s = v.replace(/@.*/, "");
                    }
                    if (v.length > 0) {
                        //������������¼�
                        if (e.keyCode === 38) {
                            //����
                            if (index <= 0) {
                                index = newArr.length;
                            }
                            index--;
                        } else if (e.keyCode === 40) {
                            //����
                            if (index >= newArr.length - 1) {
                                index = -1;
                            }
                            index++;
                        } else if (e.keyCode === 13) {
                            //�س�
                            if (index > -1 && index < newArr.length) {
                                //�����ǰ�м����б�
                                $(this).val($("#mailList_" + index).text());
                            }
                        } else {
                            if (/@/.test(v)) {
                                index = -1;
                                //���@�����ֵ
                                //s = v.replace(/@.*/, "");
                                //������ƥ������
                                var site = v.replace(/.*@/, "");
                                newArr = $.map(mailArr, function (n) {
                                    var reg = new RegExp(site);
                                    if (reg.test(n)) {
                                        return n;
                                    }
                                });
                            } else {
                                newArr = mailArr;
                            }
                        }
                        x.html($.createHtml(s, newArr, index)).css("left", 0);
                        //��꾭���б����¼�
                        //��꾭��
                        $(".mailHover").mouseover(function () {
                            index = Number($(this).attr("id").split("_")[1]);
                            liveValue = $("#mailList_" + index).text();
                            x.children("." + cf).removeClass(cf).addClass(cl);
                            $(this).addClass(cf).removeClass(cl);
                        });
                        if (e.keyCode === 13) {
                            //�س�
                            if (index > -1 && index < newArr.length) {
                                //�����ǰ�м����б�
                                x.css("left", "-6000px");
                            }
                        }
                    } else {
                        x.css("left", "-6000px");
                    }
                }).blur(function () {
                    that.parent().parent().find('.phholder')[this.value === '' ? 'show' : 'hide']();
                    if (hint && text) {
                        var blur_v = $.trim($(this).val());
                        if (blur_v === "") {
                            $(this).val(text);
                            that.parent().parent().find('.phholder')[this.value === '' ? 'show' : 'hide']();
                        }
                    }
                    $(this).css("color", bc).unbind("keyup").parent().css("z-index", 0);
                    x.css("left", "-6000px");

                });

            });

            x.on("mousedown", function () {
                that.val(liveValue);
                that.parent().parent().find('.phholder')[this.value === '' ? 'show' : 'hide']();
            });
        });
    };

})(jQuery);